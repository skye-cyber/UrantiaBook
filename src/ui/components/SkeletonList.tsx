import { Placeholder } from "./placeholder";

export const SkeletonList = ({
    count = 7,
    variant = "list-item"
}: {
    count?: number;
    variant?: "default" | "list-item"
}) => {
    return (
        <>
        {Array.from({ length: count }).map((_, i) => (
            <Placeholder key={i} variant={variant} />
        ))}
        </>
    );
};
