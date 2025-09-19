# Troubleshooting Guide

## Overview

This guide helps you resolve common issues with the Bitcoin Exchange Rates application. Issues are organized by category with step-by-step solutions and prevention tips.

## Table of Contents

- [Quick Fixes](#quick-fixes)
- [Loading and Display Issues](#loading-and-display-issues)
- [Navigation Problems](#navigation-problems)
- [Personalization Issues](#personalization-issues)
- [Performance Problems](#performance-problems)
- [PWA and Installation Issues](#pwa-and-installation-issues)
- [Accessibility Issues](#accessibility-issues)
- [Browser Compatibility](#browser-compatibility)
- [Network and API Issues](#network-and-api-issues)
- [Data and Storage Issues](#data-and-storage-issues)
- [Advanced Troubleshooting](#advanced-troubleshooting)

## Quick Fixes

### Try These First

Before diving into specific issues, try these common solutions:

1. **Refresh the page** (Ctrl+R or Cmd+R)
2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check internet connection**
4. **Try a different browser**
5. **Disable browser extensions temporarily**

### Emergency Reset

If the application is completely broken:

1. **Clear all application data**:
   - Chrome: Settings → Privacy → Clear browsing data → Advanced → All time
   - Firefox: Settings → Privacy → Clear Data → Cookies and Site Data
   - Safari: Develop → Empty Caches, then Safari → Clear History

2. **Reload the application**
3. **Reconfigure your preferences**

## Loading and Display Issues

### Rates Not Loading

**Symptoms**: Empty rate cards, "Loading..." that never completes, or error messages

**Solutions**:

1. **Check Network Connection**:
   ```
   - Verify internet connectivity
   - Try accessing other websites
   - Check if you're behind a firewall or proxy
   ```

2. **API Service Issues**:
   ```
   - Wait 30 seconds and refresh (temporary API issues)
   - Check browser console for error messages (F12)
   - Try switching to a different network
   ```

3. **Browser Issues**:
   ```
   - Clear browser cache and cookies
   - Disable ad blockers temporarily
   - Try incognito/private browsing mode
   ```

4. **Fallback Data**:
   ```
   - The app should show sample data if APIs fail
   - Look for "Sample Data" indicator in rate cards
   - This is normal behavior when offline
   ```

### Rate Cards Display Incorrectly

**Symptoms**: Malformed cards, missing information, or layout issues

**Solutions**:

1. **Browser Zoom Issues**:
   ```
   - Reset browser zoom to 100% (Ctrl+0 or Cmd+0)
   - Try different zoom levels
   - Check if compact mode is enabled in settings
   ```

2. **CSS Loading Problems**:
   ```
   - Hard refresh the page (Ctrl+Shift+R)
   - Check browser console for CSS errors
   - Verify no browser extensions are blocking CSS
   ```

3. **Theme Issues**:
   ```
   - Switch to a different theme in settings
   - Try auto theme to reset theme detection
   - Clear localStorage and reconfigure theme
   ```

### Missing Currency Flags or Symbols

**Symptoms**: Empty spaces where flags should be, or incorrect currency symbols

**Solutions**:

1. **Font and Emoji Support**:
   ```
   - Update your operating system
   - Try a different browser
   - Enable "Show Flags" in display settings
   ```

2. **Browser Settings**:
   ```
   - Check if emoji/unicode support is enabled
   - Verify font settings in browser preferences
   - Try disabling font-related browser extensions
   ```

### Slow Loading or Performance Issues

**Symptoms**: Application takes a long time to load or respond

**Solutions**:

1. **Performance Optimization**:
   ```
   - Enable reduced motion in accessibility settings
   - Disable animations in display settings
   - Try compact mode for better performance
   ```

2. **Browser Performance**:
   ```
   - Close other browser tabs
   - Restart your browser
   - Clear browser cache and temporary files
   ```

3. **Device Performance**:
   ```
   - Close other applications
   - Restart your device
   - Check available memory and storage
   ```

## Navigation Problems

### Tabs Not Switching

**Symptoms**: Clicking tabs doesn't change content, or tabs appear stuck

**Solutions**:

1. **Keyboard Navigation**:
   ```
   - Try keyboard shortcuts: 1 (BTC), 2 (BITS), 3 (Satoshi)
   - Use arrow keys to navigate between tabs
   - Press Tab key to navigate through elements
   ```

2. **JavaScript Issues**:
   ```
   - Check browser console for JavaScript errors (F12)
   - Ensure JavaScript is enabled in browser settings
   - Try disabling browser extensions that might block JS
   ```

3. **Animation Conflicts**:
   ```
   - Wait for current animations to complete
   - Enable reduced motion in accessibility settings
   - Refresh the page to reset animation state
   ```

### Page Navigation Within Tabs

**Symptoms**: Sub-navigation (Fiat per BTC vs BTC per Fiat) not working

**Solutions**:

1. **State Management Issues**:
   ```
   - Clear localStorage data for the application
   - Refresh the page to reset state
   - Try switching to a different tab and back
   ```

2. **URL Parameters**:
   ```
   - Remove any URL parameters and reload
   - Check if shared links are causing conflicts
   - Try accessing the base URL directly
   ```

### Keyboard Navigation Not Working

**Symptoms**: Keyboard shortcuts don't respond, or tab navigation is broken

**Solutions**:

1. **Focus Issues**:
   ```
   - Click on the application area first
   - Check if focus is trapped in a modal or panel
   - Press Escape to close any open panels
   ```

2. **Browser Settings**:
   ```
   - Check if "Full Keyboard Access" is enabled (Mac)
   - Verify browser accessibility settings
   - Try a different browser to isolate the issue
   ```

3. **Accessibility Mode**:
   ```
   - Enable accessibility features in settings
   - Check system accessibility preferences
   - Try using screen reader navigation if available
   ```

## Personalization Issues

### Favorites Not Saving

**Symptoms**: Favorite currencies disappear after page reload

**Solutions**:

1. **LocalStorage Issues**:
   ```
   - Check if browser allows localStorage
   - Verify you're not in incognito/private mode
   - Clear localStorage and re-add favorites
   ```

2. **Browser Settings**:
   ```
   - Enable cookies and site data in browser settings
   - Check if storage quota is exceeded
   - Verify no extensions are blocking storage
   ```

3. **Data Corruption**:
   ```
   - Export preferences before clearing data
   - Clear all application data
   - Import preferences or reconfigure manually
   ```

### Theme Not Applying

**Symptoms**: Theme changes don't take effect, or theme reverts unexpectedly

**Solutions**:

1. **CSS Variables Support**:
   ```
   - Update to a modern browser version
   - Check browser compatibility with CSS custom properties
   - Try a different browser to test
   ```

2. **System Theme Conflicts**:
   ```
   - Switch from "Auto" to manual theme selection
   - Check system dark/light mode settings
   - Try toggling system theme and back
   ```

3. **Cache Issues**:
   ```
   - Hard refresh the page (Ctrl+Shift+R)
   - Clear browser cache completely
   - Disable browser extensions that modify CSS
   ```

### Settings Not Persisting

**Symptoms**: Settings reset after closing browser or refreshing page

**Solutions**:

1. **Storage Permissions**:
   ```
   - Check browser privacy settings
   - Ensure site data is allowed to be saved
   - Verify not using incognito/private browsing
   ```

2. **Browser Cleanup**:
   ```
   - Check if browser is set to clear data on exit
   - Verify site isn't in browser's "clear on exit" list
   - Adjust browser privacy settings
   ```

3. **Data Export/Import**:
   ```
   - Export settings as backup
   - Clear all data and import settings
   - Manually reconfigure if import fails
   ```

### Search History Not Working

**Symptoms**: Search suggestions don't appear, or history is empty

**Solutions**:

1. **Search Functionality**:
   ```
   - Type at least 2 characters to trigger suggestions
   - Check if search history is enabled in settings
   - Clear search history and rebuild by searching
   ```

2. **Autocomplete Issues**:
   ```
   - Disable browser autocomplete temporarily
   - Check if browser extensions interfere with input
   - Try typing currency codes directly (USD, EUR, etc.)
   ```

## Performance Problems

### Slow Animations

**Symptoms**: Animations are choppy, delayed, or cause browser freezing

**Solutions**:

1. **Hardware Acceleration**:
   ```
   - Enable hardware acceleration in browser settings
   - Update graphics drivers
   - Close other GPU-intensive applications
   ```

2. **Performance Settings**:
   ```
   - Enable "Reduced Motion" in accessibility settings
   - Disable animations in display settings
   - Use compact mode for better performance
   ```

3. **Browser Optimization**:
   ```
   - Close unnecessary browser tabs
   - Restart browser to clear memory
   - Update browser to latest version
   ```

### High Memory Usage

**Symptoms**: Browser becomes slow, or system runs out of memory

**Solutions**:

1. **Memory Management**:
   ```
   - Refresh the page periodically
   - Close other browser tabs and applications
   - Check browser task manager (Shift+Esc in Chrome)
   ```

2. **Application Settings**:
   ```
   - Enable compact mode to reduce DOM elements
   - Disable unnecessary animations
   - Clear cache and temporary data regularly
   ```

3. **Browser Issues**:
   ```
   - Update browser to latest version
   - Reset browser settings to default
   - Try a different browser
   ```

### Slow Network Requests

**Symptoms**: Rate updates take a long time, or frequent timeouts

**Solutions**:

1. **Network Optimization**:
   ```
   - Check internet connection speed
   - Try a different network (mobile data vs WiFi)
   - Disable VPN temporarily to test
   ```

2. **API Issues**:
   ```
   - Wait for automatic fallback to secondary API
   - Check if specific API endpoints are blocked
   - Use offline mode with cached data
   ```

3. **Browser Network Settings**:
   ```
   - Clear DNS cache
   - Disable proxy settings temporarily
   - Check firewall and security software settings
   ```

## PWA and Installation Issues

### Cannot Install as PWA

**Symptoms**: No install prompt appears, or installation fails

**Solutions**:

1. **Browser Requirements**:
   ```
   - Use Chrome, Edge, or other Chromium-based browsers
   - Update browser to latest version
   - Check if PWA features are enabled in browser flags
   ```

2. **HTTPS Requirement**:
   ```
   - Ensure you're accessing via HTTPS
   - Check if localhost is being used (should work)
   - Verify SSL certificate is valid
   ```

3. **Manifest Issues**:
   ```
   - Check browser console for manifest errors
   - Verify manifest.json is accessible
   - Try refreshing and waiting for install prompt
   ```

### PWA Not Working Offline

**Symptoms**: Application doesn't work without internet connection

**Solutions**:

1. **Service Worker Issues**:
   ```
   - Check if service worker is registered (DevTools → Application)
   - Clear service worker cache and re-register
   - Verify service worker is active and running
   ```

2. **Cache Problems**:
   ```
   - Force refresh to update service worker (Ctrl+Shift+R)
   - Clear all browser data and reinstall PWA
   - Check available storage space
   ```

3. **Network Detection**:
   ```
   - Check if offline indicator appears
   - Verify cached data is available
   - Try switching to airplane mode to test offline functionality
   ```

### Background Sync Not Working

**Symptoms**: Rates don't update automatically in background

**Solutions**:

1. **Browser Permissions**:
   ```
   - Check if background sync is allowed in browser settings
   - Verify notifications permissions (if applicable)
   - Check if site is allowed to run in background
   ```

2. **PWA Installation**:
   ```
   - Ensure app is properly installed as PWA
   - Check if app is pinned or frequently used
   - Verify service worker is active
   ```

3. **System Settings**:
   ```
   - Check battery optimization settings (mobile)
   - Verify background app refresh is enabled
   - Check if power saving mode is affecting background tasks
   ```

## Accessibility Issues

### Screen Reader Problems

**Symptoms**: Screen reader doesn't announce content or navigation changes

**Solutions**:

1. **ARIA Support**:
   ```
   - Ensure screen reader software is up to date
   - Check if ARIA live regions are supported
   - Try different screen reader software (NVDA, JAWS, VoiceOver)
   ```

2. **Browser Compatibility**:
   ```
   - Use browsers with good accessibility support (Chrome, Firefox)
   - Enable accessibility features in browser settings
   - Check if browser extensions interfere with screen readers
   ```

3. **Application Settings**:
   ```
   - Enable accessibility features in application settings
   - Check if reduced motion is affecting announcements
   - Try refreshing page to reset ARIA states
   ```

### Keyboard Navigation Issues

**Symptoms**: Cannot navigate with keyboard, or focus indicators missing

**Solutions**:

1. **Focus Management**:
   ```
   - Check if focus is trapped in modal or panel
   - Press Escape to close any open dialogs
   - Click on application area to set initial focus
   ```

2. **Browser Settings**:
   ```
   - Enable "Full Keyboard Access" (Mac Safari)
   - Check browser accessibility preferences
   - Verify keyboard navigation is enabled in OS settings
   ```

3. **Visual Focus**:
   ```
   - Enable high contrast mode to see focus indicators
   - Check if custom CSS is hiding focus outlines
   - Try different themes to improve focus visibility
   ```

### High Contrast Mode Issues

**Symptoms**: High contrast mode doesn't work, or colors are incorrect

**Solutions**:

1. **System Integration**:
   ```
   - Enable high contrast in system accessibility settings
   - Check if browser respects system high contrast mode
   - Try manual high contrast toggle in application settings
   ```

2. **CSS Support**:
   ```
   - Update browser to version with better contrast support
   - Check if browser extensions modify CSS
   - Try different browsers to compare contrast support
   ```

### Large Text Mode Problems

**Symptoms**: Text doesn't scale properly, or layout breaks with large text

**Solutions**:

1. **Browser Zoom**:
   ```
   - Use browser zoom instead of application large text
   - Try different zoom levels (125%, 150%, 200%)
   - Check if layout adapts to different zoom levels
   ```

2. **System Text Size**:
   ```
   - Adjust system text size settings
   - Check if browser respects system text scaling
   - Try application large text setting in combination with system settings
   ```

## Browser Compatibility

### Older Browser Issues

**Symptoms**: Application doesn't load or features don't work in older browsers

**Solutions**:

1. **Browser Updates**:
   ```
   - Update to latest browser version
   - Check minimum browser requirements:
     - Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+
   ```

2. **Feature Support**:
   ```
   - Check if ES6 modules are supported
   - Verify Fetch API availability
   - Test CSS Grid and Flexbox support
   ```

3. **Fallback Options**:
   ```
   - Try different browser if update isn't possible
   - Use basic functionality without advanced features
   - Consider using mobile browser if desktop browser is outdated
   ```

### Mobile Browser Issues

**Symptoms**: Application doesn't work properly on mobile devices

**Solutions**:

1. **Mobile Optimization**:
   ```
   - Use mobile-optimized browsers (Chrome Mobile, Safari)
   - Check if mobile enhancements are enabled
   - Try rotating device to test different orientations
   ```

2. **Touch Interactions**:
   ```
   - Ensure touch targets are large enough
   - Check if hover effects interfere with touch
   - Try enabling mobile-specific features in settings
   ```

3. **Performance on Mobile**:
   ```
   - Enable reduced motion for better performance
   - Use compact mode to reduce resource usage
   - Close other mobile apps to free memory
   ```

### Safari-Specific Issues

**Symptoms**: Features work in other browsers but not Safari

**Solutions**:

1. **Safari Settings**:
   ```
   - Enable JavaScript in Safari preferences
   - Check if content blockers are interfering
   - Verify cookies and website data are allowed
   ```

2. **iOS Safari**:
   ```
   - Update iOS to latest version
   - Check if Low Power Mode is affecting performance
   - Try Safari in private browsing mode
   ```

3. **PWA on iOS**:
   ```
   - Use "Add to Home Screen" for PWA installation
   - Check if PWA features are limited on iOS version
   - Verify service worker support in iOS Safari
   ```

## Network and API Issues

### API Rate Limiting

**Symptoms**: "Rate limit exceeded" errors, or very slow rate updates

**Solutions**:

1. **Wait and Retry**:
   ```
   - Wait 1-5 minutes before refreshing
   - Application automatically handles rate limiting with exponential backoff
   - Check if multiple tabs are open (close extras)
   ```

2. **Fallback APIs**:
   ```
   - Application automatically switches to fallback APIs
   - Check which API source is being used (shown in rate cards)
   - Wait for automatic fallback to engage
   ```

3. **Network Issues**:
   ```
   - Check if your IP is temporarily blocked
   - Try different network connection
   - Use VPN if geographic restrictions apply
   ```

### CORS Errors

**Symptoms**: "Cross-Origin Request Blocked" errors in browser console

**Solutions**:

1. **Local Development**:
   ```
   - Use proper HTTP server (not file:// protocol)
   - Run: python3 -m http.server 8080
   - Access via http://localhost:8080
   ```

2. **Browser Security**:
   ```
   - Don't disable CORS security features
   - Use proper hosting for production deployment
   - Ensure APIs support CORS requests
   ```

### Timeout Errors

**Symptoms**: Requests timeout, or "Network timeout" messages

**Solutions**:

1. **Network Connection**:
   ```
   - Check internet connection stability
   - Try different network (WiFi vs mobile data)
   - Test connection speed and latency
   ```

2. **Application Settings**:
   ```
   - Application uses 10-second timeout by default
   - Automatic retry with exponential backoff
   - Fallback to cached data if available
   ```

3. **Firewall/Proxy Issues**:
   ```
   - Check if corporate firewall blocks API requests
   - Try disabling proxy settings temporarily
   - Verify no parental controls block cryptocurrency sites
   ```

## Data and Storage Issues

### LocalStorage Full

**Symptoms**: Settings not saving, or "Storage quota exceeded" errors

**Solutions**:

1. **Clear Storage**:
   ```
   - Clear browser data for the site
   - Export preferences before clearing
   - Remove unnecessary browser data from other sites
   ```

2. **Storage Management**:
   ```
   - Check browser storage usage in settings
   - Clear cache and temporary files
   - Increase browser storage limits if possible
   ```

### Corrupted Data

**Symptoms**: Application behaves unexpectedly, or settings are garbled

**Solutions**:

1. **Data Reset**:
   ```
   - Export current preferences (if possible)
   - Clear all application data
   - Import preferences or reconfigure manually
   ```

2. **Validation Issues**:
   ```
   - Check browser console for data validation errors
   - Try importing known-good preference file
   - Reset to default settings and reconfigure
   ```

### Cache Issues

**Symptoms**: Old data persists, or updates don't appear

**Solutions**:

1. **Cache Clearing**:
   ```
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache completely
   - Clear application cache in DevTools
   ```

2. **Service Worker Cache**:
   ```
   - Clear service worker cache in DevTools
   - Unregister and re-register service worker
   - Force update service worker
   ```

## Advanced Troubleshooting

### Browser Developer Tools

Use browser developer tools for advanced debugging:

1. **Console Tab** (F12):
   ```
   - Check for JavaScript errors (red messages)
   - Look for network request failures
   - Check for CORS or security errors
   ```

2. **Network Tab**:
   ```
   - Monitor API requests and responses
   - Check request timing and status codes
   - Verify correct API endpoints are being called
   ```

3. **Application Tab** (Chrome):
   ```
   - Check LocalStorage data
   - Verify service worker status
   - Inspect cache contents
   ```

4. **Performance Tab**:
   ```
   - Record performance profile
   - Identify slow operations
   - Check memory usage patterns
   ```

### Common Error Messages

#### "Failed to fetch rates"
- **Cause**: Network connectivity or API issues
- **Solution**: Check internet connection, wait for automatic retry

#### "LocalStorage not available"
- **Cause**: Browser privacy settings or incognito mode
- **Solution**: Enable storage, exit private browsing

#### "Service worker registration failed"
- **Cause**: HTTPS requirement or browser compatibility
- **Solution**: Use HTTPS, update browser

#### "Invalid preference data"
- **Cause**: Corrupted settings or import error
- **Solution**: Clear data, reconfigure settings

### Performance Profiling

If experiencing performance issues:

1. **Record Performance Profile**:
   ```
   - Open DevTools → Performance tab
   - Click Record button
   - Use application for 10-30 seconds
   - Stop recording and analyze results
   ```

2. **Memory Analysis**:
   ```
   - Open DevTools → Memory tab
   - Take heap snapshots before and after actions
   - Look for memory leaks or excessive usage
   ```

3. **Network Analysis**:
   ```
   - Open DevTools → Network tab
   - Refresh page and monitor all requests
   - Check for slow or failed requests
   ```

### Reporting Issues

If you can't resolve an issue:

1. **Gather Information**:
   ```
   - Browser name and version
   - Operating system
   - Steps to reproduce the issue
   - Error messages from browser console
   - Screenshots or screen recordings
   ```

2. **Test in Different Environment**:
   ```
   - Try different browser
   - Test on different device
   - Use incognito/private mode
   - Test with extensions disabled
   ```

3. **Document Workarounds**:
   ```
   - Note any temporary solutions that work
   - Record settings that cause/prevent the issue
   - Test with different application settings
   ```

## Prevention Tips

### Regular Maintenance

1. **Keep Software Updated**:
   - Update browser regularly
   - Keep operating system current
   - Update graphics drivers

2. **Manage Browser Data**:
   - Clear cache periodically
   - Export preferences as backup
   - Monitor storage usage

3. **Optimize Settings**:
   - Use appropriate theme for your environment
   - Enable accessibility features as needed
   - Configure performance settings for your device

### Best Practices

1. **Use Supported Browsers**:
   - Chrome, Firefox, Safari, Edge (latest versions)
   - Avoid Internet Explorer or very old browsers
   - Keep browser updated

2. **Network Considerations**:
   - Use stable internet connection when possible
   - Install as PWA for offline capability
   - Allow application to cache data

3. **Accessibility Setup**:
   - Configure system accessibility settings first
   - Enable application accessibility features
   - Test with assistive technologies if used

This troubleshooting guide covers the most common issues and their solutions. Most problems can be resolved with basic troubleshooting steps, but advanced users can use developer tools for deeper investigation.