# Cyanotype Negative Generator

A simple, client-side web application that allows you to convert images to cyanotype-ready negatives. Perfect for alternative photography enthusiasts, cyanotype artists, or anyone who wants to create proper negatives for cyanotype printing.

## Features

- **Easy Upload**: Drag and drop images or use the file selector
- **Automatic Processing**: Images are automatically converted to optimized cyanotype negatives
- **Batch Processing**: Convert multiple images at once
- **Side-by-Side Comparison**: View the original and cyanotype negative versions together
- **Advanced Settings**: Fine-tune contrast, density, and orientation for perfect cyanotype prints
- **One-Click Download**: Download individual negatives or all at once
- **Pure Client-Side**: No server needed, all processing happens in your browser
- **Mobile-Friendly**: Works on smartphones and tablets too

## How It Works

The app uses the HTML5 Canvas API to manipulate image data with a specialized processing pipeline for cyanotype printing:

1. **Grayscale Conversion**: Color images are converted to black and white using optimal luminance weights
2. **Contrast Enhancement**: Contrast is automatically adjusted to improve tonal separation in the final print
3. **Density Adjustment**: Negative density is optimized for transparency film printing
4. **Inversion**: The image is inverted to create a proper negative for contact printing

## Usage

1. **Upload Images**:
   - Drag and drop one or more images into the drop area
   - Or click the "Select Files" button to choose images from your device

2. **Processing**:
   - The app will automatically process your images with optimal settings for cyanotype
   - A progress bar shows the conversion status

3. **View Results**:
   - After processing, you'll see each image with its cyanotype-ready negative version
   - Compare the original and negative side by side

4. **Fine-Tune (Optional)**:
   - Click "Show Advanced Settings" to access adjustment controls
   - Adjust contrast and density sliders to optimize for your specific cyanotype process
   - Toggle "Flip Horizontally" if needed for your printing setup
   - Changes are applied in real-time to all processed images

5. **Download**:
   - Click "Download" under any image to save its cyanotype-ready negative
   - If you processed multiple images, you can click "Download All" to get a ZIP file with all negatives

## Printing Your Negatives for Cyanotype

For best results when printing your negatives for cyanotype:

1. **Use high-quality transparency film** designed for inkjet printers
2. In your printer settings, select the **highest quality print mode**
3. Allow prints to **dry completely** before using for cyanotype exposure
4. Place the printed transparency **ink-side down** on your sensitized paper
5. Expose according to your specific cyanotype process requirements

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
