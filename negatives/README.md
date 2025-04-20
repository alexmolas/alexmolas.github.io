# Image Negative Generator

A simple, client-side web application that allows you to convert images to their negative form. Perfect for photographers, hobbyists, or anyone who needs to quickly create negative versions of their images.

## Features

- **Easy Upload**: Drag and drop images or use the file selector
- **Batch Processing**: Convert multiple images at once
- **Side-by-Side Comparison**: View the original and negative versions together
- **One-Click Download**: Download individual negatives or all at once
- **Pure Client-Side**: No server needed, all processing happens in your browser
- **Mobile-Friendly**: Works on smartphones and tablets too

## How It Works

The app uses the HTML5 Canvas API to manipulate image data. It reads each pixel of the uploaded image and inverts the RGB values (subtracting each value from 255) to create the negative effect.

## Usage

1. **Upload Images**:
   - Drag and drop one or more images into the drop area
   - Or click the "Select Files" button to choose images from your device

2. **Processing**:
   - The app will automatically process your images
   - A progress bar shows the conversion status

3. **View Results**:
   - After processing, you'll see each image with its negative version
   - Compare the original and negative side by side

4. **Download**:
   - Click "Download" under any image to save its negative version
   - If you processed multiple images, you can click "Download All" to get a ZIP file with all negatives

## Deployment

This application can be deployed to any static hosting service. Here's how:

1. Upload all files to your static hosting service (GitHub Pages, Netlify, Vercel, etc.)
2. No build process or server-side code is needed
3. The app will work immediately once deployed

### Embedding in an Existing Website

You can also integrate this app into an existing website:

1. Copy the `css`, `js`, and `index.html` files to your project
2. Link to the scripts and styles from your page
3. Embed the HTML structure from `index.html` into your page

## Browser Compatibility

The application works on all modern browsers including:
- Chrome, Firefox, Safari, Edge
- Mobile browsers on iOS and Android

## License

This project is open source and available for personal and commercial use.

## Acknowledgments

- Uses [JSZip](https://stuk.github.io/jszip/) for creating downloadable ZIP archives
