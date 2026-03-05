/**
 * Test script for social media input detection logic.
 * This script simulates various input fields and verifies that the detection logic
 * correctly identifies social fields and ignores irrelevant ones.
 */

const SOCIAL_KEYWORDS = [
  'linkedin', 'github', 'twitter', 'instagram', 'portfolio', 'social', 'profile', 'website', 'facebook', 'mastodon', 'bluesky', 'threads', 'youtube', 'twitch', 'discord', 'reddit', 'tiktok', 'behance', 'dribbble', 'medium', 'substack'
];

const EXCLUDED_KEYWORDS = [
  'email', 'phone', 'tel', 'mobile', 'password', 'address', 'zip', 'city', 'state', 'country', 'postal', 'search', 'query', 'q', 'subject', 'message', 'body',
  'cc-', 'cvv', 'card', 'expiry', 'billing', 'shipping', 'login', 'signin', 'signup', 'pass', 'code', 'otp', 'token', 'captcha'
];

interface MockInput {
  type: string;
  name: string;
  placeholder: string;
  id: string;
  ariaLabel: string;
  label: string;
}

function shouldInject(input: MockInput): boolean {
  // Simulate the logic from content.ts
  const excludedTypes = ['password', 'email', 'tel', 'search', 'checkbox', 'radio'];
  if (excludedTypes.includes(input.type)) return false;

  const name = input.name.toLowerCase();
  const placeholder = input.placeholder.toLowerCase();
  const id = input.id.toLowerCase();
  const ariaLabel = input.ariaLabel.toLowerCase();
  const label = input.label.toLowerCase();

  const isSocial = SOCIAL_KEYWORDS.some(keyword => 
    name.includes(keyword) || 
    placeholder.includes(keyword) || 
    id.includes(keyword) ||
    label.includes(keyword) ||
    ariaLabel.includes(keyword)
  );

  const isExcluded = EXCLUDED_KEYWORDS.some(keyword => 
    name.includes(keyword) || 
    placeholder.includes(keyword) || 
    id.includes(keyword) ||
    label.includes(keyword) ||
    ariaLabel.includes(keyword)
  );

  return isSocial && !isExcluded;
}

const testCases: { input: MockInput; expected: boolean; description: string }[] = [
  {
    input: { type: 'text', name: 'linkedin_url', placeholder: 'LinkedIn Profile', id: 'li', ariaLabel: '', label: 'LinkedIn' },
    expected: true,
    description: 'Standard LinkedIn field'
  },
  {
    input: { type: 'text', name: 'github', placeholder: 'GitHub Username', id: 'gh', ariaLabel: '', label: 'GitHub' },
    expected: true,
    description: 'Standard GitHub field'
  },
  {
    input: { type: 'email', name: 'user_email', placeholder: 'Email Address', id: 'email', ariaLabel: '', label: 'Email' },
    expected: false,
    description: 'Email field (excluded by type)'
  },
  {
    input: { type: 'tel', name: 'phone', placeholder: 'Phone Number', id: 'phone', ariaLabel: '', label: 'Phone' },
    expected: false,
    description: 'Phone field (excluded by type)'
  },
  {
    input: { type: 'text', name: 'email_github', placeholder: 'GitHub Email', id: 'email_gh', ariaLabel: '', label: 'Email' },
    expected: false,
    description: 'Field with both social and excluded keywords (excluded by keyword)'
  },
  {
    input: { type: 'text', name: 'billing_address', placeholder: 'Address', id: 'addr', ariaLabel: '', label: 'Billing Address' },
    expected: false,
    description: 'Billing address field'
  },
  {
    input: { type: 'password', name: 'pass', placeholder: 'Password', id: 'pw', ariaLabel: '', label: 'Password' },
    expected: false,
    description: 'Password field'
  },
  {
    input: { type: 'text', name: 'twitter_handle', placeholder: '@username', id: 'tw', ariaLabel: '', label: 'Twitter' },
    expected: true,
    description: 'Twitter handle field'
  }
];

console.log('Running detection logic tests...');
let passed = 0;
testCases.forEach((tc, i) => {
  const result = shouldInject(tc.input);
  if (result === tc.expected) {
    console.log(`✅ Test ${i + 1}: ${tc.description} - PASSED`);
    passed++;
  } else {
    console.log(`❌ Test ${i + 1}: ${tc.description} - FAILED (Expected ${tc.expected}, got ${result})`);
  }
});

console.log(`\nTests completed: ${passed}/${testCases.length} passed.`);
if (passed === testCases.length) {
  process.exit(0);
} else {
  process.exit(1);
}
