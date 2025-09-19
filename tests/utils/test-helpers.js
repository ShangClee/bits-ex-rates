/**
 * Test Helper Utilities
 * Common testing utilities and assertion helpers
 */

/**
 * Wait for DOM updates and async operations
 */
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Wait for animations to complete
 */
export const waitForAnimation = (duration = 300) => 
  new Promise(resolve => setTimeout(resolve, duration + 50));

/**
 * Simulate user events
 */
export const simulateEvent = (element, eventType, options = {}) => {
  const event = new Event(eventType, { bubbles: true, cancelable: true, ...options });
  Object.assign(event, options);
  element.dispatchEvent(event);
  return event;
};

export const simulateClick = (element, options = {}) => {
  return simulateEvent(element, 'click', options);
};

export const simulateKeydown = (element, key, options = {}) => {
  return simulateEvent(element, 'keydown', { key, ...options });
};

export const simulateInput = (element, value) => {
  element.value = value;
  return simulateEvent(element, 'input', { target: { value } });
};

/**
 * DOM testing utilities
 */
export const queryByTestId = (testId, container = document) => {
  return container.querySelector(`[data-testid="${testId}"]`);
};

export const queryAllByTestId = (testId, container = document) => {
  return container.querySelectorAll(`[data-testid="${testId}"]`);
};

export const getByText = (text, container = document) => {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.includes(text)) {
      return node.parentElement;
    }
  }
  return null;
};

/**
 * Assertion helpers
 */
export const expectElementToBeVisible = (element) => {
  expect(element).toBeTruthy();
  expect(element.style.display).not.toBe('none');
  expect(element.hidden).not.toBe(true);
};

export const expectElementToBeHidden = (element) => {
  if (element) {
    expect(
      element.style.display === 'none' || 
      element.hidden === true ||
      element.classList.contains('hidden')
    ).toBe(true);
  }
};

export const expectElementToHaveClass = (element, className) => {
  expect(element).toBeTruthy();
  expect(element.classList.contains(className)).toBe(true);
};

export const expectElementToHaveAttribute = (element, attribute, value) => {
  expect(element).toBeTruthy();
  if (value !== undefined) {
    expect(element.getAttribute(attribute)).toBe(value);
  } else {
    expect(element.hasAttribute(attribute)).toBe(true);
  }
};

/**
 * Mock function helpers
 */
export const createMockFunction = (returnValue) => {
  const mockFn = jest.fn();
  if (returnValue !== undefined) {
    mockFn.mockReturnValue(returnValue);
  }
  return mockFn;
};

export const createMockPromise = (resolveValue, rejectValue) => {
  const mockFn = jest.fn();
  if (rejectValue) {
    mockFn.mockRejectedValue(rejectValue);
  } else {
    mockFn.mockResolvedValue(resolveValue);
  }
  return mockFn;
};

/**
 * Local storage testing utilities
 */
export const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    get store() { return { ...store }; }
  };
};

/**
 * API testing utilities
 */
export const mockSuccessfulApiResponse = (data) => {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  };
};

export const mockFailedApiResponse = (status = 500, message = 'Server Error') => {
  return {
    ok: false,
    status,
    statusText: message,
    json: () => Promise.reject(new Error(message)),
    text: () => Promise.reject(new Error(message))
  };
};

/**
 * Module testing utilities
 */
export const createModuleTestEnvironment = () => {
  // Create a clean DOM environment for module testing
  document.body.innerHTML = '';
  
  // Add basic HTML structure that modules expect
  const mainContainer = document.createElement('div');
  mainContainer.id = 'main-container';
  document.body.appendChild(mainContainer);
  
  // Add tab structure
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';
  tabContainer.innerHTML = `
    <div class="main-tabs">
      <button id="btc-tab" class="main-tab-btn active" data-tab="btc">BTC</button>
      <button id="bts-tab" class="main-tab-btn" data-tab="bts">BITS</button>
      <button id="sts-tab" class="main-tab-btn" data-tab="sts">Satoshi</button>
    </div>
    <div class="tab-content">
      <div id="btc-content" class="tab-pane active">
        <div id="fiat-per-btc-container" class="rate-container"></div>
        <div id="btc-per-fiat-container" class="rate-container"></div>
      </div>
      <div id="bts-content" class="tab-pane">
        <div id="fiat-per-bits-container" class="rate-container"></div>
        <div id="bits-per-fiat-container" class="rate-container"></div>
      </div>
      <div id="sts-content" class="tab-pane">
        <div id="fiat-per-satoshi-container" class="rate-container"></div>
        <div id="satoshi-per-fiat-container" class="rate-container"></div>
      </div>
    </div>
  `;
  mainContainer.appendChild(tabContainer);
  
  return mainContainer;
};

export const cleanupModuleTestEnvironment = () => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
};