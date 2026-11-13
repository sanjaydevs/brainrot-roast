
export function getScoreTheme(score: number) {
  if (score <= 35) {
    return {
      label: 'HEALTHY',
      description: 'Your screen time is relatively under control. For now.',
      color: '#22C55E',
      textClass: 'text-green-400',
      borderClass: 'border-green-500',
      bgClass: 'bg-green-500',
    }
  }

  if (score <= 65) {
    return {
      label: 'GETTING CONCERNING',
      description: 'Your phone is starting to become a problem.',
      color: '#EAB308',
      textClass: 'text-yellow-400',
      borderClass: 'border-yellow-500',
      bgClass: 'bg-yellow-500',
    }
  }

  return {
    label: 'COOKED',
    description: 'Your screen time needs serious attention.',
    color: '#EF4444',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
    bgClass: 'bg-red-500',
  }
}
