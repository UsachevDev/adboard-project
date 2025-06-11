// src/components/ui/Modal/Modal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Закрытие по клику вне модального окна
    const handleOverlayClick = (event: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    // Закрытие по нажатию Esc
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Предотвращаем скролл body, когда модальное окно открыто
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            // Возвращаем скролл body, когда модальное окно закрыто
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset'; // На случай размонтирования
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null; // Не рендерим, если не открыто

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={handleOverlayClick}>
            <div className={styles.modalContent} ref={modalRef}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times; {/* Символ 'x' для закрытия */}
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
