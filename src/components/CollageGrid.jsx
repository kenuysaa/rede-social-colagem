import React, { useRef } from 'react';

/**
 * Componente de Grid de Colagem.
 * @param {Object} props
 * @param {string[]} props.images - Array de URLs (preview ou final)
 * @param {Function} [props.onImageSelect] - (Opcional) Callback ao clicar no slot vazio
 * @param {number} props.layout - Número de slots (3, 4 ou 6)
 * @param {boolean} [props.editable] - Se true, permite clicar para adicionar foto
 */
export default function CollageGrid({ images, onImageSelect, layout, editable = false }) {
    const fileInputRef = useRef(null);
    const activeIndex = useRef(null);

    const handleSlotClick = (index) => {
        if (!editable || !onImageSelect) return;
        activeIndex.current = index;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && activeIndex.current !== null) {
            onImageSelect(file, activeIndex.current);
        }
    };

    // Definição das classes do Grid baseada na quantidade de itens (Layout)
    const getGridClass = () => {
        switch (layout) {
            case 3: return "grid-cols-2 grid-rows-2"; // 1 Grande, 2 Pequenos
            case 4: return "grid-cols-2 grid-rows-2"; // 2x2 Clássico
            case 6: return "grid-cols-3 grid-rows-2"; // 3x2 Panorâmico ou vertical denso
            default: return "grid-cols-2";
        }
    };

    // Lógica para saber qual slot ocupa quanto espaço (spans)
    const getSlotClass = (index) => {
        const baseClass = "relative overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-900";

        // Layout de 3 fotos: A primeira ocupa 2 colunas (destaque)
        if (layout === 3 && index === 0) return `${baseClass} col-span-2 row-span-1 h-48`;
        if (layout === 3) return `${baseClass} col-span-1 row-span-1 h-48`;

        // Layout de 4 fotos: Todas iguais
        if (layout === 4) return `${baseClass} col-span-1 h-40`;

        // Layout de 6 fotos: Menores
        if (layout === 6) return `${baseClass} col-span-1 h-32`;

        return baseClass;
    };

    // Cria um array do tamanho do layout para renderizar os slots
    const slots = Array.from({ length: layout });

    return (
        <div className={`w-full grid gap-1 rounded-lg overflow-hidden ${getGridClass()}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {slots.map((_, index) => (
                <div
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`${getSlotClass(index)} ${editable ? 'cursor-pointer hover:bg-zinc-700 transition' : ''}`}
                >
                    {images[index] ? (
                        <img
                            src={images[index]}
                            alt={`Slot ${index}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // Ícone de placeholder se estiver vazio e for editável
                        editable && (
                            <span className="text-zinc-500 text-4xl font-light">+</span>
                        )
                    )}
                </div>
            ))}
        </div>
    );
}
