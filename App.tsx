
import React, { useState, useCallback, useEffect } from 'react';
import { ConversionMode, ConversionStatus, Page } from './types';
import { UploadIcon } from './components/UploadIcon';
import { FileIcon } from './components/FileIcon';
import { Spinner } from './components/Spinner';
import { SuccessIcon } from './components/SuccessIcon';
import { StepUploadIcon } from './components/StepUploadIcon';
import { StepConvertIcon } from './components/StepConvertIcon';
import { StepDownloadIcon } from './components/StepDownloadIcon';
import { SecurityIcon } from './components/SecurityIcon';
import { QualityIcon } from './components/QualityIcon';
import { SpeedIcon } from './components/SpeedIcon';

const App: React.FC = () => {
  const [mode, setMode] = useState<ConversionMode>(ConversionMode.PDF_TO_WORD);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>('idle');
  const [currentPage, setCurrentPage] = useState<Page>('converter');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Clear file and errors when conversion mode changes
  useEffect(() => {
    handleReset();
  }, [mode]);

  const handleReset = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setConversionStatus('idle');
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setConversionStatus('converting');
    setErrorMessage(null);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // In a real application, the API key should be handled securely.
    // This example uses an environment variable as a placeholder.
    if (process.env.API_KEY) {
        formData.append('api_key', process.env.API_KEY);
    }

    try {
        // This is a placeholder API endpoint. Replace with your actual conversion service.
        const response = await fetch('https://api.example.com/convert', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Conversion failed. The server responded with an error.');
        }

        const data = await response.json();

        if (data.downloadUrl) {
            setDownloadUrl(data.downloadUrl);
            setConversionStatus('success');
        } else {
            throw new Error('Conversion succeeded, but no download URL was provided.');
        }

    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setErrorMessage(message);
        setConversionStatus('idle'); // Revert to idle on error to allow retry
    }
  };

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) return;

    const allowedExtensions = mode === ConversionMode.PDF_TO_WORD 
        ? ['.pdf'] 
        : ['.doc', '.docx'];
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

    if (allowedExtensions.includes(fileExtension)) {
      setSelectedFile(file);
      setErrorMessage(null);
      setDownloadUrl(null);
    } else {
      setSelectedFile(null);
      setErrorMessage('Invalid file type. Please select a valid file.');
      setDownloadUrl(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSetFile(file);
    event.target.value = ''; // Allow re-selecting the same file
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    validateAndSetFile(file);
  }, [mode]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const getFileAcceptType = () => {
    return mode === ConversionMode.PDF_TO_WORD ? '.pdf' : '.doc,.docx';
  };
  
  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedFile(null);
  };
  
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const renderConverterUI = () => {
    switch (conversionStatus) {
      case 'converting':
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <Spinner />
            <p className="mt-4 text-lg font-semibold text-gray-700">Converting your file...</p>
            <p className="text-sm text-gray-500">please wait.</p>
          </div>
        );
      case 'success':
        return (
            <div className="flex flex-col items-center justify-center text-center h-64">
                <SuccessIcon />
                <h3 className="mt-4 text-2xl font-bold text-gray-800">Your file is ready!</h3>
                <div className="mt-8 w-full">
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            download
                            className="w-full block bg-green-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
                        >
                            Download File
                        </a>
                    )}
                    <button
                        onClick={handleReset}
                        className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500 focus:outline-none"
                    >
                        Convert Another File
                    </button>
                </div>
            </div>
        );
      case 'idle':
      default:
        return (
          <>
            <label 
                htmlFor="file-upload" 
                className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${
                    isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${selectedFile ? '' : 'cursor-pointer hover:border-gray-400'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
            >
              {!selectedFile ? (
                  <>
                    <UploadIcon />
                    <span className="mt-2 block font-semibold text-gray-700">
                      Drag & drop your file here
                    </span>
                    <span className="text-xs text-gray-500">or</span>
                    <span className="mt-1 block font-semibold text-blue-600 hover:text-blue-500">
                      Click to Upload
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileIcon />
                    <span className="mt-2 block font-semibold text-gray-700 break-all">{selectedFile.name}</span>
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="mt-2 text-sm text-red-600 hover:text-red-500 font-semibold focus:outline-none"
                    >
                        Remove file
                    </button>
                  </div>
                )}
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept={getFileAcceptType()}
                    onChange={handleFileChange}
                    disabled={!!selectedFile}
                />
            </label>
             <p className="text-xs text-gray-500 text-center mt-4">
              Accepted file types: {getFileAcceptType().split(',').map(t => t.toUpperCase()).join(', ')}
            </p>

            <div className="h-6 mt-2 text-center">
                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            </div>

            <div className="mt-4">
                <button
                type="button"
                onClick={handleConvert}
                // FIX: This comparison is redundant because `conversionStatus` is narrowed to 'idle' in this code branch.
                disabled={!selectedFile}
                className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                {/* FIX: This comparison is redundant because `conversionStatus` is narrowed to 'idle' in this code branch. */}
                Convert Now
                </button>
            </div>
          </>
        );
    }
  };

  const renderPageContent = () => {
    if (currentPage === 'converter') {
      return (
        <div id="converter-section">
          <section className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              The Ultimate <span className="text-blue-600">PDF & Word</span> Converter
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Fast, secure, and high-quality conversions for all your documents.
            </p>
          </section>

          <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-2">
            <div role="tablist" aria-label="Conversion modes" className="flex p-1 bg-gray-100 rounded-lg">
              <button
                id="tab-pdf-to-word"
                role="tab"
                aria-selected={mode === ConversionMode.PDF_TO_WORD}
                aria-controls="tabpanel-converter"
                onClick={() => setMode(ConversionMode.PDF_TO_WORD)}
                className={`w-1/2 p-3 rounded-md text-center font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  mode === ConversionMode.PDF_TO_WORD
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                PDF to Word
              </button>
              <button
                id="tab-word-to-pdf"
                role="tab"
                aria-selected={mode === ConversionMode.WORD_TO_PDF}
                aria-controls="tabpanel-converter"
                onClick={() => setMode(ConversionMode.WORD_TO_PDF)}
                className={`w-1/2 p-3 rounded-md text-center font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  mode === ConversionMode.WORD_TO_PDF
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Word to PDF
              </button>
            </div>

            <div
              id="tabpanel-converter"
              role="tabpanel"
              aria-labelledby={mode === ConversionMode.PDF_TO_WORD ? 'tab-pdf-to-word' : 'tab-word-to-pdf'}
              className="p-8"
              tabIndex={0}
            >
              {renderConverterUI()}
            </div>
          </div>

          <section className="w-full max-w-5xl mx-auto mt-20 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Simple, Fast, and Free</h2>
                <p className="mt-3 text-lg text-gray-500">Converting your documents has never been easier.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                        <StepUploadIcon />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">1. Upload File</h3>
                    <p className="mt-2 text-base text-gray-500">Drag and drop or select your PDF or Word document from your device.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                        <StepConvertIcon />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">2. We Convert It</h3>
                    <p className="mt-2 text-base text-gray-500">Our system processes your file securely in seconds, ensuring high quality.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                        <StepDownloadIcon />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-gray-900">3. Download Ready</h3>
                    <p className="mt-2 text-base text-gray-500">Your new file is ready to download immediately, completely free.</p>
                </div>
            </div>
          </section>

          <section className="w-full max-w-5xl mx-auto py-12 bg-gray-100 rounded-lg">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Our Converter?</h2>
                  <p className="mt-3 text-lg text-gray-500">Your privacy and quality are our top priorities.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center px-6">
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600">
                          <SecurityIcon />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-gray-900">Bank-Level Security</h3>
                      <p className="mt-2 text-base text-gray-500">We use SSL encryption and automatically delete all files from our servers within an hour. Your privacy is guaranteed.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600">
                          <QualityIcon />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-gray-900">High-Quality Conversions</h3>
                      <p className="mt-2 text-base text-gray-500">Our advanced conversion engine preserves the original formatting, images, and text alignment of your document.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600">
                          <SpeedIcon />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-gray-900">Blazing-Fast Speed</h3>
                      <p className="mt-2 text-base text-gray-500">No queues, no waiting. Your document is converted in seconds, so you can get back to what matters most.</p>
                  </div>
              </div>
          </section>

        </div>
      );
    }
    
    // Static Pages Content
    return (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8 my-10 prose lg:prose-lg">
            {currentPage === 'about' && (
                <section id="about-page">
                    <h2>About FileConverter</h2>
                    <p>In a digital world overflowing with complex software and subscription-based services, we saw a need for simplicity. FileConverter was born from a simple idea: document conversion should be easy, fast, and accessible to everyone, without any hidden costs or complicated steps. We believe that managing your documents shouldn't be a chore.</p>
                    <p>Our mission is to provide a reliable, secure, and user-friendly tool for the most common document conversion needs. We've started with the essentials—PDF to Word and Word to PDF—and have dedicated ourselves to making this process as seamless as possible. We use advanced conversion technology to ensure your documents retain their original formatting, from tables and images to text alignment.</p>
                    <p>We are a small, passionate team of developers and designers who are committed to creating high-quality tools that make a difference. Your privacy is our top priority; we never store your files on our servers. All conversions are done in memory, and your files are automatically deleted after the process is complete. Thank you for trusting FileConverter with your documents.</p>
                </section>
            )}
            {currentPage === 'contact' && (
                <section id="contact-page">
                    <h2>Contact Us</h2>
                    <p>We value your feedback and are here to help with any questions you may have. Whether you have a suggestion, a support request, or just want to say hello, please don't hesitate to reach out.</p>
                    <form onSubmit={handleContactSubmit} className="mt-8 space-y-6 not-prose">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                            <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" name="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Send Message
                            </button>
                        </div>
                    </form>
                </section>
            )}
            {currentPage === 'privacy' && (
                <section id="privacy-page">
                    <h2>Privacy Policy</h2>
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    <p>Your privacy is critically important to us. At FileConverter, we have a few fundamental principles that we follow:</p>
                    
                    <h3>Information We Collect</h3>
                    <p>We do not collect any personal information from our users. You can use our service without creating an account or providing any personal data.</p>
                    
                    <h3>File Handling and Data Security</h3>
                    <p>We are committed to ensuring the security of your files. All files uploaded to our servers are processed for the sole purpose of conversion. We do not view, copy, or analyze your files in any way. All connections to our service use Secure Sockets Layer (SSL) to encrypt the data transferred between your browser and our servers.</p>

                    <h3>File Deletion</h3>
                    <p>We do not store your files. All uploaded and converted files are permanently deleted from our servers within one hour of conversion. We do not keep any backups or logs of your files. This automated process ensures that your data remains private.</p>

                    <h3>How We Use Your Information</h3>
                    <p>Since we do not collect personal information, we do not use it for any purpose. For non-personally-identifying information (like browser type, and language preference), we may use it in aggregate to better understand how our visitors use the service and to make improvements.</p>
                    
                    <h3>Changes to This Policy</h3>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                </section>
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16">
            <div className="flex-shrink-0">
              <button onClick={() => handleNavClick('converter')} className="text-2xl font-bold text-blue-600 focus:outline-none">
                FileConverter
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {renderPageContent()}
      </main>

      <footer className="w-full py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p className="mb-4 text-sm">&copy; {new Date().getFullYear()} FileConverter. Developed by Hsini Mohamed.</p>
            <div className="flex justify-center space-x-6">
                <button id="about-link" onClick={() => handleNavClick('about')} className="text-sm font-semibold hover:text-blue-600 focus:outline-none">About</button>
                <button id="contact-link" onClick={() => handleNavClick('contact')} className="text-sm font-semibold hover:text-blue-600 focus:outline-none">Contact</button>
                <button id="privacy-link" onClick={() => handleNavClick('privacy')} className="text-sm font-semibold hover:text-blue-600 focus:outline-none">Privacy Policy</button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
