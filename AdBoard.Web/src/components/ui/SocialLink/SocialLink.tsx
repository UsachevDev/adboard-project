import React from 'react';
import Image from 'next/image';
import styles from './SocialLink.module.scss';

interface SocialLinkProps {
  href: string;
  iconSrc: string;
  alt: string;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, iconSrc, alt, label }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialLink}>
      <Image src={iconSrc} alt={alt} width={24} height={24} className={styles.icon} />
    </a>
  );
};

export default SocialLink;
