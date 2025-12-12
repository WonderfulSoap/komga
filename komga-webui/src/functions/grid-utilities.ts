export function computeCardWidth (width: number, breakpoint: string, cardPadding: number = 16): number {
  const SAFETY_MARGIN = 6
  const available = Math.max(width - (cardPadding * 2), 0)
  const minTwoColumnWidth = Math.max(Math.floor((available - SAFETY_MARGIN) / 2), 0)
  const defaultWidth = 150

  switch (breakpoint) {
    case 'xs':
      return minTwoColumnWidth
    default:
      return Math.min(defaultWidth, minTwoColumnWidth || defaultWidth)
  }
}
