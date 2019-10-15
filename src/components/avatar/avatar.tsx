import React from 'react';

import styles from './avatar.module.scss';

// @TODO: Make color scheme for this
function getColorFromInitials(initials: string): string {
  const [first, second] = initials.toUpperCase().split('');
  const number = first.charCodeAt(0) + (second && second.charCodeAt(0) || 0);
  const percent = Math.max(0, Math.min(1, 1 / 180 * number));

  return '#' + ((1 << 24) * percent | 0).toString(16);
}

function getInitials(value: string): string | null {
  if (/\@/.test(value)) {
    const [firstPart] = value.split('@');
    const initials = getInitials(firstPart);

    return initials;
  }

  if (/ /.test(value)) {
    const [first, last] = value.split(' ');

    return `${first[0]}${last[0]}`;
  }

  if (/\./.test(value)) {
    const [first, last] = value.split('.');

    return `${first[0]}${last[0]}`;
  }

  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
    const [first, last] = value.split(/[a-z]+/);

    return `${first[0]}${last[0]}`;
  }

  return null;
}

const Avatar: React.FC<{ src: string, color?: string }> = ({ src, color }) => {
  const initials = getInitials(src) || (src && src[0]);
  const colorData = color || getColorFromInitials(initials);

  return (
    <div className={styles.avatar} style={{ backgroundColor: colorData }}>
      {initials}
    </div>
  );
}

export default Avatar;
