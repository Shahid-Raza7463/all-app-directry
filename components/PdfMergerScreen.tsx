import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  saveDocuments,
  types,
} from '@react-native-documents/picker';
import {PDFDocument} from 'pdf-lib';
import RNFS from 'react-native-fs';

type Step = 'select' | 'preview' | 'merging' | 'result';
type PdfFile = {
  id: string;
  name: string;
  size: string;
  pages: number;
  selected: number[];
  path: string;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const filePath = (uri: string) =>
  decodeURIComponent(uri.replace('file://', ''));
const fileSize = (bytes: number | null) =>
  bytes === null ? 'Unknown size' : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const Steps = ({step}: {step: Step}) => {
  const active = step === 'select' ? 1 : step === 'preview' ? 2 : 3;
  return (
    <View style={styles.steps}>
      {['Select', 'Preview', 'Done'].map((label, index) => {
        const number = index + 1;
        const complete = number < active || step === 'result';
        const highlighted = complete || number === active;
        return (
          <React.Fragment key={label}>
            {index > 0 && (
              <View style={[styles.line, number <= active && styles.lineOn]} />
            )}
            <View style={styles.step}>
              <View style={[styles.dot, highlighted && styles.dotOn]}>
                {complete ? (
                  <Feather name="check" size={13} color="#FFF" />
                ) : (
                  <Text
                    style={[styles.dotText, highlighted && styles.dotTextOn]}>
                    {number}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepText, highlighted && styles.stepTextOn]}>
                {label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const Button = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    activeOpacity={0.85}
    style={styles.button}
    onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
    <Feather name={icon} size={18} color="#FFF" />
  </TouchableOpacity>
);

const PdfMergerScreen = () => {
  const [step, setStep] = useState<Step>('select');
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [error, setError] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [outputPath, setOutputPath] = useState('');
  const count = useMemo(
    () => files.reduce((sum, file) => sum + file.selected.length, 0),
    [files],
  );

  const chooseFiles = async () => {
    setIsPicking(true);
    setError('');
    try {
      const pickedFiles = await pick({
        type: [types.pdf],
        allowMultiSelection: true,
        mode: 'import',
      });
      const invalidType = pickedFiles.find(file => !file.hasRequestedType);
      const oversized = pickedFiles.find(
        file => file.size !== null && file.size > MAX_FILE_SIZE,
      );
      if (invalidType) {
        throw new Error('Only PDF files can be selected.');
      }
      if (oversized) {
        throw new Error(
          `${oversized.name ?? 'A selected file'} exceeds 50 MB.`,
        );
      }

      const parsedFiles = await Promise.all(
        pickedFiles.map(async (pickedFile, index) => {
          const name = pickedFile.name ?? `document-${index + 1}.pdf`;
          const [copy] = await keepLocalCopy({
            destination: 'cachesDirectory',
            files: [
              {
                uri: pickedFile.uri,
                fileName: `${Date.now()}-${index}-${name}`,
              },
            ],
          });
          if (copy.status !== 'success') {
            throw new Error(`Unable to read ${name}.`);
          }
          const path = filePath(copy.localUri);
          const base64 = await RNFS.readFile(path, 'base64');
          const pdf = await PDFDocument.load(base64);
          return {
            id: `${pickedFile.uri}-${index}`,
            name,
            size: fileSize(pickedFile.size),
            pages: pdf.getPageCount(),
            selected: [],
            path,
          };
        }),
      );
      setFiles(parsedFiles);
    } catch (pickerError) {
      if (
        !isErrorWithCode(pickerError) ||
        pickerError.code !== errorCodes.OPERATION_CANCELED
      ) {
        setError(
          pickerError instanceof Error
            ? pickerError.message
            : 'Unable to read the selected PDF files.',
        );
      }
    } finally {
      setIsPicking(false);
    }
  };
  const togglePage = (id: string, page: number) => {
    setFiles(current =>
      current.map(file =>
        file.id !== id
          ? file
          : {
              ...file,
              selected: file.selected.includes(page)
                ? file.selected.filter(item => item !== page)
                : [...file.selected, page].sort((a, b) => a - b),
            },
      ),
    );
    setError('');
  };
  const toggleAll = (id: string) =>
    setFiles(current =>
      current.map(file =>
        file.id !== id
          ? file
          : {
              ...file,
              selected:
                file.selected.length === file.pages
                  ? []
                  : Array.from({length: file.pages}, (_, i) => i + 1),
            },
      ),
    );
  const review = () =>
    count
      ? setStep('preview')
      : setError('Select at least one page to continue.');
  const merge = async () => {
    setStep('merging');
    setError('');
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        if (!file.selected.length) {
          continue;
        }
        const base64 = await RNFS.readFile(file.path, 'base64');
        const sourcePdf = await PDFDocument.load(base64);
        const pages = await mergedPdf.copyPages(
          sourcePdf,
          file.selected.map(page => page - 1),
        );
        pages.forEach(page => mergedPdf.addPage(page));
      }
      const mergedBase64 = await mergedPdf.saveAsBase64();
      const path = `${
        RNFS.DocumentDirectoryPath
      }/merged_document_${Date.now()}.pdf`;
      await RNFS.writeFile(path, mergedBase64, 'base64');
      setOutputPath(path);
      setStep('result');
    } catch {
      setError('The selected pages could not be merged. Please try again.');
      setStep('preview');
    }
  };
  const reset = () => {
    setFiles([]);
    setError('');
    setOutputPath('');
    setStep('select');
  };
  const saveOutput = async () => {
    try {
      await saveDocuments({
        sourceUris: [`file://${outputPath}`],
        mimeType: types.pdf,
        fileName: outputPath.split('/').pop(),
        copy: true,
      });
      setError('');
    } catch (saveError) {
      if (
        !isErrorWithCode(saveError) ||
        saveError.code !== errorCodes.OPERATION_CANCELED
      ) {
        setError('The merged PDF could not be saved.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Feather name="layers" size={20} color="#FFF" />
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.kicker}>PDF TOOLS</Text>
          <Text style={styles.brand}>Page Merger</Text>
        </View>
        <Feather name="help-circle" size={21} color="#687386" />
      </View>
      <Steps step={step} />

      {step === 'select' && (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <Text style={styles.title}>
              {files.length ? 'Choose your pages' : 'Merge PDFs, your way'}
            </Text>
            <Text style={styles.subtitle}>
              {files.length
                ? 'Select the pages you want in your new document.'
                : 'Pick multiple files, choose exactly what you need, and combine them in seconds.'}
            </Text>
            {!files.length ? (
              <View style={styles.empty}>
                <View style={styles.upload}>
                  <Feather name="upload-cloud" size={34} color="#5B5BD6" />
                </View>
                <Text style={styles.emptyTitle}>Add your PDF files</Text>
                <Text style={styles.emptyText}>
                  Select one or multiple PDF documents to get started
                </Text>
                <TouchableOpacity
                  style={styles.chooseButton}
                  disabled={isPicking}
                  onPress={chooseFiles}>
                  {isPicking ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Feather name="plus" size={18} color="#FFF" />
                  )}
                  <Text style={styles.chooseText}>
                    {isPicking ? 'Reading PDFs…' : 'Select PDF'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.hint}>PDF only · Up to 50 MB per file</Text>
              </View>
            ) : (
              <>
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>
                    {files.length} PDFs selected
                  </Text>
                </View>
                {files.map((file, fileIndex) => (
                  <View style={styles.card} key={file.id}>
                    <View style={styles.fileRow}>
                      <View style={styles.pdf}>
                        <Text style={styles.pdfText}>PDF</Text>
                      </View>
                      <View style={styles.fileCopy}>
                        <Text style={styles.fileName}>{file.name}</Text>
                        <Text style={styles.meta}>
                          {file.pages} pages · {file.size}
                        </Text>
                      </View>
                      <TouchableOpacity
                        accessibilityLabel={`Remove ${file.name}`}
                        onPress={() =>
                          setFiles(items =>
                            items.filter(item => item.id !== file.id),
                          )
                        }>
                        <Feather name="trash-2" size={18} color="#98A1B2" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.sectionRow}>
                      <Text style={styles.pagesLabel}>PAGES</Text>
                      <TouchableOpacity onPress={() => toggleAll(file.id)}>
                        <Text style={styles.link}>
                          {file.selected.length === file.pages
                            ? 'Deselect all'
                            : 'Select all'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.pageGrid}>
                      {Array.from({length: file.pages}, (_, i) => i + 1).map(
                        page => {
                          const checked = file.selected.includes(page);
                          return (
                            <TouchableOpacity
                              key={page}
                              onPress={() => togglePage(file.id, page)}
                              style={[styles.page, checked && styles.pageOn]}>
                              <View
                                style={[
                                  styles.check,
                                  checked && styles.checkOn,
                                ]}>
                                {checked && (
                                  <Feather
                                    name="check"
                                    size={12}
                                    color="#FFF"
                                  />
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.pageText,
                                  checked && styles.pageTextOn,
                                ]}>
                                Page {page}
                              </Text>
                            </TouchableOpacity>
                          );
                        },
                      )}
                    </View>
                    <Text style={styles.order}>File {fileIndex + 1}</Text>
                  </View>
                ))}
              </>
            )}
            {!!error && (
              <View style={styles.error}>
                <Feather name="alert-circle" size={18} color="#B42318" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </ScrollView>
          {!!files.length && (
            <View style={styles.footer}>
              <View>
                <Text style={styles.totalLabel}>TOTAL SELECTED</Text>
                <Text style={styles.total}>{count} pages</Text>
              </View>
              <View style={styles.grow}>
                <Button
                  label="Review merge"
                  icon="arrow-right"
                  onPress={review}
                />
              </View>
            </View>
          )}
        </>
      )}

      {step === 'preview' && (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Ready to merge?</Text>
            <Text style={styles.subtitle}>
              Review your selection before creating the final document.
            </Text>
            <View style={styles.summary}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryIcon}>
                  <Feather name="file-text" size={28} color="#5B5BD6" />
                </View>
                <Text style={styles.summaryTitle}>Merged document</Text>
                <Text style={styles.meta}>
                  {count} pages from {files.length} PDF files
                </Text>
              </View>
              <View style={styles.divider} />
              {files.map((file, index) => (
                <View style={styles.summaryRow} key={file.id}>
                  <View style={styles.number}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.fileCopy}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.selectedPages}>
                      {file.selected.map(page => `Page ${page}`).join(', ')}
                    </Text>
                  </View>
                  <Text style={styles.badge}>{file.selected.length} pg</Text>
                </View>
              ))}
            </View>
            <View style={styles.info}>
              <Feather name="shield" size={19} color="#3171D8" />
              <Text style={styles.infoText}>
                Your files are processed securely and stay on this device.
              </Text>
            </View>
            {!!error && (
              <View style={styles.error}>
                <Feather name="alert-circle" size={18} color="#B42318" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setStep('select')}>
              <Feather name="arrow-left" size={18} color="#424B5A" />
              <Text style={styles.secondaryText}>Edit pages</Text>
            </TouchableOpacity>
            <View style={styles.grow}>
              <Button label="Merge PDF" icon="layers" onPress={merge} />
            </View>
          </View>
        </>
      )}

      {step === 'merging' && (
        <View style={styles.center}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#5B5BD6" />
          </View>
          <Text style={styles.loadingTitle}>Merging your pages…</Text>
          <Text style={styles.subtitle}>
            Creating one beautiful, organized PDF
          </Text>
          <View style={styles.loadingBar}>
            <View style={styles.loadingFill} />
          </View>
          <Text style={styles.hint}>This will only take a moment</Text>
        </View>
      )}

      {step === 'result' && (
        <ScrollView contentContainerStyle={styles.result}>
          <View style={styles.success}>
            <Feather name="check" size={34} color="#FFF" />
          </View>
          <Text style={styles.resultTitle}>PDF merged successfully!</Text>
          <Text style={styles.resultText}>
            Your {count}-page document is ready to use.
          </Text>
          <View style={styles.resultCard}>
            <View style={styles.pdf}>
              <Text style={styles.pdfText}>PDF</Text>
            </View>
            <View style={styles.fileCopy}>
              <Text style={styles.fileName}>{outputPath.split('/').pop()}</Text>
              <Text style={styles.meta}>{count} pages · Ready</Text>
            </View>
            <View style={styles.ready} />
          </View>
          <View style={styles.full}>
            <Button
              label="Save merged PDF"
              icon="download"
              onPress={saveOutput}
            />
          </View>
          <TouchableOpacity style={styles.inline} onPress={reset}>
            <Feather name="plus" size={16} color="#687386" />
            <Text style={styles.another}>Merge another document</Text>
          </TouchableOpacity>
          {!!error && (
            <View style={styles.error}>
              <Feather name="alert-circle" size={18} color="#B42318" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F7F8FC'},
  header: {
    height: 76,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF3',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#5B5BD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCopy: {flex: 1, marginLeft: 11},
  kicker: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9AA2B1',
    letterSpacing: 1.6,
  },
  brand: {fontSize: 18, fontWeight: '800', color: '#202637'},
  steps: {
    height: 77,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 14,
    backgroundColor: '#FFF',
  },
  step: {width: 56, alignItems: 'center'},
  dot: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#EEF0F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: {backgroundColor: '#5B5BD6'},
  dotText: {fontSize: 12, fontWeight: '700', color: '#9BA3B1'},
  dotTextOn: {color: '#FFF'},
  stepText: {fontSize: 10, fontWeight: '600', color: '#9BA3B1', marginTop: 5},
  stepTextOn: {color: '#4A5262'},
  line: {width: 58, height: 2, marginTop: 13, backgroundColor: '#E6E9EF'},
  lineOn: {backgroundColor: '#5B5BD6'},
  content: {padding: 20, paddingBottom: 32},
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    color: '#1D2433',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#687386',
    marginTop: 7,
    marginBottom: 22,
  },
  empty: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBCDEA',
    padding: 32,
    alignItems: 'center',
  },
  upload: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#EFEFFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  emptyTitle: {fontSize: 19, fontWeight: '800', color: '#252B3A'},
  emptyText: {
    fontSize: 13,
    color: '#7D8697',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 7,
  },
  chooseButton: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 24,
    backgroundColor: '#5B5BD6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
  },
  chooseText: {fontSize: 15, fontWeight: '700', color: '#FFF'},
  hint: {fontSize: 10, color: '#A0A7B5', marginTop: 14},
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  sectionTitle: {fontSize: 13, fontWeight: '700', color: '#5B6474'},
  inline: {flexDirection: 'row', alignItems: 'center', gap: 5},
  link: {fontSize: 11, fontWeight: '700', color: '#5B5BD6'},
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8EAF0',
    elevation: 2,
  },
  fileRow: {flexDirection: 'row', alignItems: 'center'},
  pdf: {
    width: 41,
    height: 47,
    borderRadius: 9,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFDADA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfText: {fontSize: 10, fontWeight: '900', color: '#E54B4B'},
  fileCopy: {flex: 1, marginLeft: 11},
  fileName: {fontSize: 14, fontWeight: '700', color: '#262D3C'},
  meta: {fontSize: 11, color: '#9098A7', marginTop: 4},
  divider: {height: 1, backgroundColor: '#EEF0F4', marginVertical: 14},
  pagesLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9AA2B1',
    letterSpacing: 1.2,
  },
  pageGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  page: {
    height: 35,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E2E5EB',
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  pageOn: {borderColor: '#C9C9F6', backgroundColor: '#F1F1FD'},
  check: {
    width: 17,
    height: 17,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#C2C7D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  checkOn: {backgroundColor: '#5B5BD6', borderColor: '#5B5BD6'},
  pageText: {fontSize: 11, fontWeight: '600', color: '#6D7687'},
  pageTextOn: {color: '#4A4AB8'},
  order: {
    position: 'absolute',
    right: 15,
    top: 53,
    fontSize: 9,
    color: '#B0B6C1',
  },
  error: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FEF3F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  errorText: {fontSize: 12, color: '#B42318', marginLeft: 8, fontWeight: '600'},
  footer: {
    minHeight: 84,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E7E9EE',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  grow: {flex: 1},
  totalLabel: {
    fontSize: 9,
    color: '#9BA3B1',
    fontWeight: '800',
    letterSpacing: 1,
  },
  total: {fontSize: 15, color: '#313847', fontWeight: '800', marginTop: 3},
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#5B5BD6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    elevation: 3,
  },
  buttonText: {color: '#FFF', fontSize: 14, fontWeight: '800'},
  summary: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E7E9EE',
    padding: 17,
  },
  summaryTop: {alignItems: 'center', paddingVertical: 10},
  summaryIcon: {
    width: 61,
    height: 61,
    borderRadius: 18,
    backgroundColor: '#EFEFFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  summaryTitle: {fontSize: 17, fontWeight: '800', color: '#252B3A'},
  summaryRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 10},
  number: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#F0F1F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {fontSize: 11, fontWeight: '800', color: '#626C7C'},
  selectedPages: {fontSize: 10, color: '#9098A7', marginTop: 3},
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#747E8E',
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    padding: 6,
  },
  info: {
    borderRadius: 14,
    backgroundColor: '#EEF6FF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  infoText: {fontSize: 11, color: '#4C6687', marginLeft: 10, flex: 1},
  secondary: {
    height: 52,
    paddingHorizontal: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBDEE5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  secondaryText: {fontSize: 13, fontWeight: '700', color: '#424B5A'},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loader: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 4,
  },
  loadingTitle: {fontSize: 23, fontWeight: '800', color: '#252B3A'},
  loadingBar: {
    width: '78%',
    height: 7,
    borderRadius: 5,
    backgroundColor: '#E4E5F4',
    overflow: 'hidden',
  },
  loadingFill: {width: '72%', height: '100%', backgroundColor: '#5B5BD6'},
  result: {
    flexGrow: 1,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#27AE7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#222938',
    textAlign: 'center',
  },
  resultText: {fontSize: 13, color: '#7D8695', marginTop: 8, marginBottom: 26},
  resultCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E5E8ED',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  ready: {width: 9, height: 9, borderRadius: 5, backgroundColor: '#27AE7A'},
  full: {width: '100%'},
  share: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D6D6F5',
    backgroundColor: '#F9F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginVertical: 11,
  },
  shareText: {fontSize: 14, fontWeight: '800', color: '#5B5BD6'},
  another: {fontSize: 12, fontWeight: '700', color: '#687386'},
});

export default PdfMergerScreen;
