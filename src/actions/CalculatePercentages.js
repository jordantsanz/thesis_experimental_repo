import { accuracyPercentRanges, errorPercentRanges, affectPercentRanges } from '../lib/constants';

export const calculateAccuracyPercent = (accuracyArray) => {
  const {
    COMPLETELY_CORRECT, PARTIALLY_CORRECT, NOT_CORRECT, PARTIAL_AND_NOT_BOUND, COMPLETELY_AND_PARTIAL_BOUND,
  } = accuracyPercentRanges;
  const totalNotes = accuracyArray.length;

  let numberCorrect = 0;
  for (let i = 0; i < totalNotes; i += 1) {
    if (accuracyArray[i] === 1) {
      numberCorrect += 1;
    }
  }

  const percent = numberCorrect / totalNotes;
  console.log('accuracy percent: ', percent);
  if (percent >= COMPLETELY_AND_PARTIAL_BOUND) {
    return COMPLETELY_CORRECT;
  } else if (percent < PARTIAL_AND_NOT_BOUND) {
    return NOT_CORRECT;
  } else {
    return PARTIALLY_CORRECT;
  }
};

export const calculateErrorPercent = (errorArray) => {
  const {
    COMPLETELY_CORRECT,
    VERY_CORRECT,
    PARTIALLY_CORRECT,
    NOT_CORRECT,
    COMPLETELY_CORRECT_UPPER_BOUND,
    VERY_CORRECT_UPPER_BOUND,
    PARTIALLY_CORRECT_UPPER_BOUND,
  } = errorPercentRanges;
  const totalNotes = errorArray.length;
  let totalScore = 0;

  for (let i = 0; i < totalNotes; i += 1) {
    const time = errorArray[i];

    if (time <= COMPLETELY_CORRECT_UPPER_BOUND) {
      totalScore += COMPLETELY_CORRECT;
    } else if (time <= VERY_CORRECT_UPPER_BOUND) {
      totalScore += VERY_CORRECT;
    } else if (time <= PARTIALLY_CORRECT_UPPER_BOUND) {
      totalScore += PARTIALLY_CORRECT;
    } else {
      totalScore += NOT_CORRECT;
    }
  }

  const percent = totalScore / totalNotes;
  if (percent <= accuracyPercentRanges.PARTIAL_AND_NOT_BOUND) {
    return accuracyPercentRanges.NOT_CORRECT;
  } else if (percent <= accuracyPercentRanges.COMPLETELY_AND_PARTIAL_BOUND) {
    return accuracyPercentRanges.PARTIALLY_CORRECT;
  } else {
    return accuracyPercentRanges.COMPLETELY_CORRECT;
  }
};

export const calculateAffectPercent = (affectDict) => {
  console.log('calcuate affect percent ');
  const {
    NO_NEGATIVE_AFFECT_PERCENT, NO_NEGATIVE_AFFECT_UPPER_BOUND, PARTIAL_NEGATIVE_AFFECT_PERCENT, PARTIAL_NEGATIVE_AFFECT_UPPER_BOUND, MAJOR_NEGATIVE_AFFECT_PERCENT,
  } = affectPercentRanges;
  const sum = Object.values(affectDict).reduce((a, b) => a + b);
  console.log(sum);
  const percent = sum;
  if (percent <= NO_NEGATIVE_AFFECT_UPPER_BOUND) {
    return NO_NEGATIVE_AFFECT_PERCENT;
  } else if (percent > PARTIAL_NEGATIVE_AFFECT_UPPER_BOUND) {
    return PARTIAL_NEGATIVE_AFFECT_PERCENT;
  } else {
    return MAJOR_NEGATIVE_AFFECT_PERCENT;
  }
};
