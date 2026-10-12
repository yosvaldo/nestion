type Props = {label: string, disabled: boolean, process: string}

function SubmitButton({disabled, label, process}: Props) {
    return (
        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? process : label}
        </button>
    );
}

export default SubmitButton;