interface IconProps {
  width?: number;
  height?: number;
}

export function SlackIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
    </svg>
  );
}

export function GmailIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  );
}

export function AnthropicIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-6.994 0H10.44L17 20h-3.603L10.044 11.4 6.833 20H3.23L10.044 3.52 6.833 3.52z" fill="#D97757"/>
    </svg>
  );
}

export function PostgresIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.128 0a10.134 10.134 0 0 0-2.755.403C13.63.257 12.924.2 12.24.2 9.689.199 7.766.71 6.273 1.628 4.571.833 2.987.762 1.944 1.5.207 2.614-.422 5.36.276 8.333c.55 2.302 1.686 3.99 2.96 4.336.22 1.775.696 3.24 1.44 4.052.13.143.273.268.424.373-.09.345-.13.7-.12 1.053.013 1.058.428 1.913.997 2.42-.018.114-.04.226-.04.344 0 1.395.771 2.362 2.003 2.362.742 0 1.4-.397 1.875-1.007l1.456.836c-.246 1.29.273 2.172 1.426 2.172.858 0 1.84-.625 2.801-2.027.408-.591.77-1.257 1.09-1.998.744.24 1.538.363 2.35.363 3.498 0 6.256-2.485 6.256-7.5 0-5.164-2.47-8.077-6.176-8.077zm.13 1.52c2.886 0 4.793 2.262 4.793 6.677 0 4.415-2.07 6.27-4.858 6.27a6.896 6.896 0 0 1-2.4-.453c-.016-.05-.033-.1-.054-.148.622-.855 1.204-1.909 1.735-3.11 1.073-2.43 1.69-5.061 1.747-7.434a3.86 3.86 0 0 1 1.038-.802zM12 1.634c.514 0 1.015.05 1.477.146-.162.132-.32.274-.472.426-1.1 1.1-2.006 2.878-2.69 5.034-.65 2.056-1.023 4.35-1.069 6.554l-.254-.12c-1.024-.493-1.946-1.8-2.365-4.782l-.08.044a2.82 2.82 0 0 1-.123-.614 2.39 2.39 0 0 1 .123-.778c.356.047.719.031 1.07-.05.86-.196 1.463-.672 1.665-1.34a1.3 1.3 0 0 0 .026-.244c0-.394-.175-.752-.456-1.024.154-.177.315-.34.482-.49C10.147 3.8 10.976 3.4 12 3.4a7.8 7.8 0 0 1 0-1.766z" fill="#336791"/>
    </svg>
  );
}

export function WebhookIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ApolloIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3F20BA"/>
      <path d="M8.5 16L12 8l3.5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IfIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function RobotIcon({ width = 16, height = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9B59B6" strokeWidth="1.5"/>
      <path d="M12 11V7" stroke="#9B59B6" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="6" r="2" stroke="#9B59B6" strokeWidth="1.5"/>
      <circle cx="8.5" cy="15.5" r="1.5" fill="#9B59B6"/>
      <circle cx="15.5" cy="15.5" r="1.5" fill="#9B59B6"/>
      <path d="M9 19h6" stroke="#9B59B6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
