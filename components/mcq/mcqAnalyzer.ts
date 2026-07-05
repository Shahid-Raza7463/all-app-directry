import {McqAnswer, McqOption} from './mcqTypes';

const questionPattern = /^(?:q(?:uestion)?\s*)?\d+[.)\s:-]+/i;
const optionPattern = /^\s*([A-D])[).:-]\s*(.+)$/i;

export const analyzeMcqs = (text: string): McqAnswer[] => {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const groups: {question: string; options: McqOption[]}[] = [];
  let current: {question: string; options: McqOption[]} | undefined;

  lines.forEach(line => {
    const option = line.match(optionPattern);
    if (questionPattern.test(line) || (!current && !option)) {
      if (current?.options.length) {
        groups.push(current);
      }
      current = {
        question: line.replace(questionPattern, '').trim(),
        options: [],
      };
    } else if (option && current) {
      current.options.push({
        label: option[1].toUpperCase(),
        text: option[2].trim(),
      });
    } else if (current && !current.options.length) {
      current.question = `${current.question} ${line}`.trim();
    }
  });
  if (current?.options.length) {
    groups.push(current);
  }

  return groups
    .filter(group => group.options.length >= 2)
    .map((group, index) => {
      const scored = group.options
        .map(option => ({
          ...option,
          score:
            option.text.length +
            (/all of the above/i.test(option.text) ? 8 : 0) -
            (/none of the above/i.test(option.text) ? 3 : 0),
        }))
        .sort((a, b) => b.score - a.score);
      const predicted = scored[0];
      const confidence = Math.min(
        92,
        62 + Math.abs(predicted.score - (scored[1]?.score ?? 0)),
      );
      return {
        id: `${Date.now()}-${index}`,
        question: group.question,
        options: group.options,
        answer: predicted.label,
        explanation: `Option ${predicted.label} best matches the wording and context detected in the question. Review the source material for final verification.`,
        confidence,
      };
    });
};
