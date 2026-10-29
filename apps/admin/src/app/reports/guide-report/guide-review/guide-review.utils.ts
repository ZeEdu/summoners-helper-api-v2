export const GuideReviewUtils = {
  cleanDOMElements: (value: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      value,
      'text/html',
    );
    return doc.body.textContent || '';
  }
}