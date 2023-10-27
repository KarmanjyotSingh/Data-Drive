import { useCallback, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;
const PdfRender = (props) => {
    const [file, setFile] = useState(props.fileData);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [containerRef, setContainerRef] = useState(null);
    const [containerWidth, setContainerWidth] = useState(0);


    const handlePageChange = (newPageNumber) => {
        if (newPageNumber >= 1 && newPageNumber <= numPages) {
            setPageNumber(newPageNumber);
        }
    }


    return (
        <div className="Example">
            <div className="Example__container">
                <div className="Example__container__document" ref={setContainerRef}>
                    <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)} options={options}>
                        <div className='pdf-preview'>
                            <Page
                                onLoadSuccess={({ width }) => setContainerWidth(width)}
                                key={`page_${pageNumber}`}
                                pageNumber={pageNumber}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className='page-navigation'>
                            <button className="nav-button left-button" onClick={() => handlePageChange(pageNumber - 1)}>Previous</button>
                            <span className="nav-button page-number">Page {pageNumber} of {numPages}</span>
                            <button className="nav-button right-button" onClick={() => handlePageChange(pageNumber + 1)}>Next</button>
                        </div>
                    </Document>
                </div>
            </div>
        </div>
    );
}

export default PdfRender;