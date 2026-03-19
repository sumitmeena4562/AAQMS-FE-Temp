
export const getChangeStyles = (changeType) => {
    const styles = {
        positive: {
            text: 'text-green-700',
            bg: 'bg-green-50',
        },
        neutral: {
            text: 'text-slate-600',
            bg: 'bg-slate-100',
        },
        warning: {
            text: 'text-orange-700',
            bg: 'bg-orange-50',
        },
        negative: {
            text: 'text-red-700',
            bg: 'bg-red-50',
        },
    };
    return styles[changeType] || styles.neutral;
};