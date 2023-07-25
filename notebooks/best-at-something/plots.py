import matplotlib as mpl

# Set font size for labels and text
mpl.rcParams['font.size'] = 15

# Use LaTeX to format labels (optional, but recommended)
mpl.rcParams['text.usetex'] = True

# Set figure size in inches (width, height)
mpl.rcParams['figure.figsize'] = (7, 7)

# Set resolution of figures to 300 dpi (optional, but recommended)
# mpl.rcParams['figure.dpi'] = 300

# Set linewidth for all lines
mpl.rcParams['lines.linewidth'] = 1.5

# Set the default style to use black lines with different line styles
mpl.rcParams['lines.color'] = 'black'
mpl.rcParams['lines.linestyle'] = '-'

# Use different line styles to differentiate between curves
line_styles = ['-', '--', ':', '-.']
line_colors = ['black', 'black', 'black', 'black']
mpl.rcParams['axes.prop_cycle'] = mpl.cycler(linestyle=line_styles, color=line_colors)

# Set the background color to white
mpl.rcParams['axes.facecolor'] = 'white'

# Set the edge color for axes and ticks to black
mpl.rcParams['axes.edgecolor'] = 'black'
mpl.rcParams['xtick.color'] = 'black'
mpl.rcParams['ytick.color'] = 'black'

# Set the linewidth for the axes and ticks
mpl.rcParams['axes.linewidth'] = 1.5
mpl.rcParams['xtick.major.width'] = 1.5
mpl.rcParams['ytick.major.width'] = 1.5

# Set the tick length
mpl.rcParams['xtick.major.size'] = 4
mpl.rcParams['ytick.major.size'] = 4

# Turn on grid lines
mpl.rcParams['axes.grid'] = True

# Use this line to save the figure as a PDF (optional, but recommended)
mpl.rcParams['pdf.fonttype'] = 42
