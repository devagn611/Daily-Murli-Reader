export function transformHtmlToText(htmlContent: string): string {
  // Create a temporary div element
  var tempDiv = document.createElement('div');
  
  // Set the HTML content of the div
  tempDiv.innerHTML = htmlContent;

  // Use textContent or innerText to get the plain text (ignores HTML tags)
  return tempDiv.textContent || tempDiv.innerText || '';
}
