export function computeCardWidth (width: number, breakpoint: string, cardPadding: number = 16): number {
  const available = Math.max(width - (cardPadding * 2), 0)
  const minTwoColumnWidth = available / 2
  const defaultWidth = 150

  switch (breakpoint) {
    case 'xs':
      return minTwoColumnWidth
    default:
      return Math.min(defaultWidth, minTwoColumnWidth || defaultWidth)
  }
}
