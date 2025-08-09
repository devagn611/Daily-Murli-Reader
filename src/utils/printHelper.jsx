const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const selectedLanguage = languageOptions.find(opt => opt.value === language)?.label;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daily Murli - ${formattedDate}</title>
          <style>
            body {
              font-family: Georgia, serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #ccc;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              margin: 0 0 10px 0;
            }
            .date {
              font-size: 18px;
              margin: 5px 0;
            }
            .language {
              font-size: 14px;
              color: #666;
              margin: 5px 0;
            }
            .content {
              font-size: ${fontSize}px;
              text-align: justify;
            }
            .content h1, .content h2, .content h3 {
              color: #333;
              margin-top: 25px;
              margin-bottom: 15px;
            }
            .content p {
              margin-bottom: 15px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ccc;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Daily Murli</h1>
            <p class="date">${formattedDate}</p>
            <p class="language">Language: ${selectedLanguage}</p>
          </div>
          <div class="content">
            ${murliContent}
          </div>
          <div class="footer">
            <p>© Brahma Kumaris World Spiritual University</p>
            <p>Source: madhubanmurli.org</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

export default handlePrint;