/**
 * ResponsiveMarginContainer Component
 * 
 * A fully responsive container with 120px top/bottom and 240px left/right margins
 * that scales down appropriately for smaller screens to prevent horizontal scrolling.
 * 
 * Features:
 * - 120px top/bottom, 240px left/right margins on large screens (1400px+)
 * - Responsive scaling following the existing breakpoint system
 * - Prevents horizontal overflow on mobile devices
 * - Smooth transitions between breakpoints
 * - Box-sizing: border-box for consistent sizing
 * 
 * Usage:
 * <ResponsiveMarginContainer>
 *   <YourContent />
 * </ResponsiveMarginContainer>
 * 
 * Or with custom className:
 * <ResponsiveMarginContainer className="custom-class">
 *   <YourContent />
 * </ResponsiveMarginContainer>
 */

const ResponsiveMarginContainer = ({ 
  children, 
  className = "", 
  style = {},
  ...props 
}) => {
  return (
    <div 
      className={`responsive-margin-container ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveMarginContainer;
