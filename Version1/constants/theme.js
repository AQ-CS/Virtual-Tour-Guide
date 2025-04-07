// constants/theme.js

const COLORS = {
    primary: '#3E54AC',      // A royal blue - primary brand color
    secondary: '#655DBB',    // Purple - secondary brand color
    accent: '#BFACE2',       // Light purple - for accents
    
    background: '#FFFFFF',   // White - app background
    card: '#F9F9F9',         // Light gray - card backgrounds
    
    text: '#333333',         // Dark gray - primary text
    textSecondary: '#666666', // Medium gray - secondary text
    textLight: '#999999',     // Light gray - tertiary text
    
    success: '#4CAF50',      // Green - success states
    warning: '#FFC107',      // Amber - warning states
    error: '#F44336',        // Red - error states
    
    border: '#E0E0E0',       // Light gray - borders
    divider: '#EEEEEE',      // Lighter gray - dividers
    
    // Cultural-inspired colors
    gold: '#D4AF37',         // Traditional gold
    teal: '#048B9A',         // Cultural teal blue
    sand: '#E6DDC6'          // Desert sand
  };
  
  const FONT = {
    regular: 'Roboto_400Regular',
    medium: 'Roboto_500Medium',
    bold: 'Roboto_700Bold',
  };
  
  const SIZES = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    
    // Specific sizing
    borderRadius: 8,
    buttonHeight: 48,
    iconSize: 24,
    headerHeight: 60,
    cardPadding: 16,
  };
  
  const SHADOWS = {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 6,
    },
  };
  
  export { COLORS, FONT, SIZES, SHADOWS };