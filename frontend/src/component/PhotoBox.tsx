interface PhotoBoxProps {
    imageUrl: string;
    label: string;
    height?: number;
}

// Shows the photo, or a crossed-out placeholder box when there is no photo.
// The height changes per page, so it is set with a style instead of a class.
export default function PhotoBox({ imageUrl, label, height = 200 }: PhotoBoxProps) {
    if (imageUrl) {
        return <img className="sketch block w-full object-cover" src={imageUrl} alt={label} style={{ height }} />;
    }

    return (
        <div className="sketch photo-placeholder flex w-full items-center justify-center" style={{ height }}>
            <span className="bg-paper-gray px-2">{label}</span>
        </div>
    );
}