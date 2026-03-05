/**
 * Content script for Fill-4-Me
 * Detects social media input fields and provides a UI to fill them.
 */

console.log('Fill-4-Me: Content script loaded');

const SOCIAL_KEYWORDS = [
  'linkedin', 'github', 'twitter', 'instagram', 'portfolio', 'social', 'profile', 'website'
];

function findSocialInputs() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="url"]');
  inputs.forEach(input => {
    const name = input.getAttribute('name')?.toLowerCase() || '';
    const placeholder = input.getAttribute('placeholder')?.toLowerCase() || '';
    const id = input.getAttribute('id')?.toLowerCase() || '';
    const label = document.querySelector(`label[for="${input.id}"]`)?.textContent?.toLowerCase() || '';

    const isSocial = SOCIAL_KEYWORDS.some(keyword => 
      name.includes(keyword) || 
      placeholder.includes(keyword) || 
      id.includes(keyword) ||
      label.includes(keyword)
    );

    if (isSocial && !(input as HTMLElement).dataset.fill4me) {
      injectFillButton(input as HTMLInputElement);
    }
  });
}

function injectFillButton(input: HTMLInputElement) {
  (input as HTMLElement).dataset.fill4me = 'true';
  input.style.position = 'relative';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  wrapper.style.width = '100%';
  
  input.parentNode?.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const button = document.createElement('button');
  button.innerHTML = 'F';
  button.title = 'Fill with Fill-4-Me';
  button.style.cssText = `
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
    opacity: 0.6;
    transition: opacity 0.2s;
  `;

  button.onmouseover = () => button.style.opacity = '1';
  button.onmouseout = () => button.style.opacity = '0.6';
  
  button.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real extension, this would open a message to the background script
    // to get the saved profiles and show a dropdown.
    alert('Fill-4-Me: In a real extension, this would show your saved profiles here!');
  };

  wrapper.appendChild(button);
}

// Watch for DOM changes to find dynamically added inputs
const observer = new MutationObserver(() => {
  findSocialInputs();
});

observer.observe(document.body, { childList: true, subtree: true });
findSocialInputs();
