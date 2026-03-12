import React, { useState, useRef, useEffect } from 'react';

/**
 * Lazy Image Component with Blur Placeholder
 */
const LazyImage = ({
    src,
    alt,
    placeholder = null,
    className = '',
    style = {},
    width = 'auto',
    height = 'auto',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={imgRef}
            className={`lazy-image-container ${className}`}
            style={{
                position: 'relative',
                width,
                height,
                overflow: 'hidden',
                borderRadius: style.borderRadius || '0',
                ...style
            }}
        >
            {placeholder && !isInView && (
                <img
                    src={placeholder}
                    alt=""
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        filter: 'blur(10px)',
                        transform: 'scale(1.1)',
                        transition: 'opacity 0.3s ease'
                    }}
                    aria-hidden="true"
                />
            )}

            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        ...style
                    }}
                    {...props}
                />
            )}

            {!isInView && !placeholder && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-border) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-secondary)',
                        fontSize: '12px'
                    }}
                >
                    Loading...
                </div>
            )}
        </div>
    );
};

/**
 * Lazy Background Image Component
 */
export const LazyBackgroundImage = ({
    src,
    placeholder = null,
    className = '',
    style = {},
    children,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`lazy-bg-container ${className}`}
            style={{
                position: 'relative',
                backgroundImage: isInView ? `url(${src})` : (placeholder ? `url(${placeholder})` : 'none'),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: isInView && !isLoaded ? 'blur(5px)' : 'none',
                transition: 'filter 0.3s ease',
                ...style
            }}
            {...props}
        >
            {isInView && (
                <img
                    src={src}
                    alt=""
                    style={{ display: 'none' }}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
            {children}
        </div>
    );
};

/**
 * Memoized Component Wrapper
 */
export const MemoizedComponent = ({ children, dependencies = [] }) => {
    return React.memo(children, (prevProps, nextProps) => {
        return dependencies.every(dep => {
            return prevProps[dep] === nextProps[dep];
        });
    });
};

/**
 * Virtualized List Component for Long Lists
 */
export const VirtualizedList = ({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    className = '',
    style = {}
}) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    const visibleItems = React.useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
            startIndex + Math.ceil(containerHeight / itemHeight) + 1,
            items.length
        );

        return items.slice(startIndex, endIndex).map((item, index) => ({
            ...item,
            index: startIndex + index
        }));
    }, [items, itemHeight, containerHeight, scrollTop]);

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };

    return (
        <div
            ref={containerRef}
            className={`virtualized-list ${className}`}
            style={{
                height: containerHeight,
                overflow: 'auto',
                position: 'relative',
                ...style
            }}
            onScroll={handleScroll}
        >
            <div style={{ height: items.length * itemHeight, position: 'relative' }}>
                {visibleItems.map((item) => (
                    <div
                        key={item.id || item.index}
                        style={{
                            position: 'absolute',
                            top: item.index * itemHeight,
                            left: 0,
                            right: 0,
                            height: itemHeight
                        }}
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Debounced Input Component
 */
export const DebouncedInput = ({
    value,
    onChange,
    debounceMs = 300,
    className = '',
    style = {},
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(value);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onChange(newValue);
        }, debounceMs);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <input
            value={internalValue}
            onChange={handleChange}
            className={className}
            style={{
                padding: '8px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                transition: 'border-color 0.2s ease',
                ...style
            }}
            onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-info)';
            }}
            onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
            }}
            {...props}
        />
    );
};

export default LazyImage;