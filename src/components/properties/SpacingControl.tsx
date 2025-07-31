import React from 'react';
import { MoveVertical, MoveHorizontal, Link, Unlink } from 'lucide-react';

// Smart Spacing Control Component
interface SpacingControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const parseSpacing = (spacingValue: string) => {
    const getNumericValue = (val: string) => {
        const num = parseFloat(val);
        return isNaN(num) ? '' : String(num);
    };
    const parts = (spacingValue || '').trim().split(/\s+/).filter(Boolean).map(getNumericValue);
    switch (parts.length) {
        case 1:
            return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
        case 2:
            return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
        case 3:
            return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
        case 4:
            return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
        default:
            return { top: '', right: '', bottom: '', left: '' };
    }
};

const combineSpacing = (sides: { top: string; right: string; bottom: string; left: string }) => {
    const { top, right, bottom, left } = sides;
    const withPx = (v: string) => (v ? `${v}px` : '0px');
    const t = withPx(top);
    const r = withPx(right);
    const b = withPx(bottom);
    const l = withPx(left);

    if (t === r && r === b && b === l) return t;
    if (t === b && r === l) return `${t} ${r}`;
    if (r === l) return `${t} ${r} ${b}`;
    return `${t} ${r} ${b} ${l}`;
};

const ScrubbableInput: React.FC<{
    value: string;
    onChange: (newValue: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    icon: React.ReactNode;
    axis: 'x' | 'y';
}> = ({ value, onChange, onBlur, placeholder, icon, axis }) => {
    const dragStartRef = React.useRef<{ x: number; y: number; value: number; isDragging: boolean } | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const onChangeRef = React.useRef(onChange);

    // Keep onChangeRef up to date without causing re-renders of callbacks
    React.useEffect(() => {
        onChangeRef.current = onChange;
    });

    const parseValue = (val: string): number => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const handleDragMove = React.useCallback(
        (e: MouseEvent) => {
            if (!dragStartRef.current || !dragStartRef.current.isDragging) return;
            e.preventDefault();
            
            const { x, y, value: startValue } = dragStartRef.current;
            let delta;
            
            if (axis === 'y') {
                // Vertical drag: up increases, down decreases
                delta = y - e.clientY;
            } else {
                // Horizontal drag: right increases, left decreases
                delta = e.clientX - x;
            }
            
            // Apply sensitivity (adjust this value to change drag sensitivity)
            const sensitivity = 0.5;
            const newValue = startValue + (delta * sensitivity);
            
            // Ensure value doesn't go below 0
            const clampedValue = Math.max(0, Math.round(newValue));
            onChangeRef.current(String(clampedValue));
        },
        [axis] // `onChange` is now accessed via a ref, so it's not a dependency.
    );

    const handleDragEnd = React.useCallback(() => {
        if (dragStartRef.current) {
            dragStartRef.current.isDragging = false;
        }
        setIsDragging(false);
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, [handleDragMove]); // handleDragMove is stable, so this is stable too

    const handleDragStart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentValue = parseValue(value);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            value: currentValue,
            isDragging: true
        };
        
        setIsDragging(true);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        
        // Set cursor and prevent text selection
        document.body.style.cursor = axis === 'y' ? 'ns-resize' : 'ew-resize';
        document.body.style.userSelect = 'none';
    };

    React.useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [handleDragMove, handleDragEnd]);

    return (
        <div className='relative'>
            <div 
                onMouseDown={handleDragStart} 
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center transition-colors ${
                    isDragging 
                        ? 'text-blue-600 cursor-ns-resize' 
                        : 'text-gray-400 hover:text-gray-600 cursor-ns-resize'
                }`}
                title={`Drag to adjust ${axis === 'y' ? 'vertical' : 'horizontal'} spacing`}
            >
                {icon}
            </div>
            <input
                type='text'
                className={`w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : ''
                }`}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                readOnly={isDragging}
            />
            {isDragging && (
                <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none rounded" />
            )}
        </div>
    );
};

const SpacingControl: React.FC<SpacingControlProps> = ({ label, value, onChange, placeholder = '0px' }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const sides = React.useMemo(() => parseSpacing(value), [value]);
    const allSidesEqual = sides.top === sides.right && sides.right === sides.bottom && sides.bottom === sides.left;
    const [isLinked, setIsLinked] = React.useState(allSidesEqual);

    const handleSideChange = (side: 'top' | 'right' | 'bottom' | 'left', newValue: string) => {
        const newSides = { ...sides, [side]: newValue || '' };
        onChange(combineSpacing(newSides));
    };

    const handleLinkedChange = (newValue: string) => {
        const val = newValue || '';
        const newSides = { top: val, right: val, bottom: val, left: val };
        onChange(combineSpacing(newSides));
    };

    const handleBlur = (side: 'top' | 'right' | 'bottom' | 'left') => {
        handleSideChange(side, sides[side]);
    };

    const handleShorthandChange = (newValue: string) => {
        onChange(newValue);
    };

    return (
        <div className='space-y-2'>
            <div className='flex items-center justify-between'>
                <label className='block text-sm font-medium text-gray-700'>{label}</label>
                <button type='button' onClick={() => setIsExpanded(!isExpanded)} className='text-xs text-blue-600 hover:text-blue-800'>
                    {isExpanded ? 'Simple' : 'Advanced'}
                </button>
            </div>

            {!isExpanded ? (
                <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={value}
                    onChange={(e) => handleShorthandChange(e.target.value)}
                    placeholder={placeholder}
                />
            ) : (
                <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                        {isLinked ? (
                            <div className='flex-grow'>
                                <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={sides.top || ''}
                                    onChange={(e) => handleLinkedChange(e.target.value)}
                                    onBlur={() => handleLinkedChange(sides.top)}
                                    placeholder='0'
                                />
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 gap-2 flex-grow'>
                                <ScrubbableInput
                                    value={sides.top}
                                    onChange={(v) => handleSideChange('top', v)}
                                    onBlur={() => handleBlur('top')}
                                    placeholder='0'
                                    icon={<MoveVertical className='w-3 h-3' />}
                                    axis='y'
                                />
                                <ScrubbableInput
                                    value={sides.right}
                                    onChange={(v) => handleSideChange('right', v)}
                                    onBlur={() => handleBlur('right')}
                                    placeholder='0'
                                    icon={<MoveHorizontal className='w-3 h-3' />}
                                    axis='x'
                                />
                                <ScrubbableInput
                                    value={sides.bottom}
                                    onChange={(v) => handleSideChange('bottom', v)}
                                    onBlur={() => handleBlur('bottom')}
                                    placeholder='0'
                                    icon={<MoveVertical className='w-3 h-3' />}
                                    axis='y'
                                />
                                <ScrubbableInput
                                    value={sides.left}
                                    onChange={(v) => handleSideChange('left', v)}
                                    onBlur={() => handleBlur('left')}
                                    placeholder='0'
                                    icon={<MoveHorizontal className='w-3 h-3' />}
                                    axis='x'
                                />
                            </div>
                        )}
                        <button
                            type='button'
                            onClick={() => {
                                const newIsLinked = !isLinked;
                                setIsLinked(newIsLinked);
                                if (newIsLinked) {
                                    handleLinkedChange(sides.top || '');
                                }
                            }}
                            className='p-2 rounded-md hover:bg-gray-200'
                            title={isLinked ? 'Unlink sides' : 'Link sides'}
                        >
                            {isLinked ? <Link className='w-4 h-4 text-blue-600' /> : <Unlink className='w-4 h-4 text-gray-500' />}
                        </button>
                    </div>

                    {/* Visual Preview */}
                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <div className='text-xs text-gray-500 mb-2'>Preview</div>
                        <div className='relative w-full h-16 bg-white border-2 border-gray-300 rounded'>
                            <div className='absolute inset-0 flex items-center justify-center text-xs text-gray-400'>Content</div>
                            {/* Top indicator */}
                            <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs text-blue-600'>{sides.top ? `${sides.top}px` : '0px'}</div>
                            {/* Right indicator */}
                            <div className='absolute top-1/2 -right-1 transform -translate-y-1/2 text-xs text-blue-600'>{sides.right ? `${sides.right}px` : '0px'}</div>
                            {/* Bottom indicator */}
                            <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-blue-600'>{sides.bottom ? `${sides.bottom}px` : '0px'}</div>
                            {/* Left indicator */}
                            <div className='absolute top-1/2 -left-1 transform -translate-y-1/2 text-xs text-blue-600'>{sides.left ? `${sides.left}px` : '0px'}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpacingControl;