export const CreativeStudio: React.FC = () => {
    const [savedState, setSavedState] = useState(() => {
        try {
            const item = localStorage.getItem('creativeStudioState');
            return item ? JSON.parse(item) : {};
        } catch {
            return {};
        }
    });

    const [editablePrompt, setEditablePrompt] = useState<string>(() => {
        // Check for remix prompt first
        const remixPrompt = localStorage.getItem('remixPrompt');
        if (remixPrompt) {
            localStorage.removeItem('remixPrompt');
            return remixPrompt;
        }
        return savedState.editablePrompt || "";
    });
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);