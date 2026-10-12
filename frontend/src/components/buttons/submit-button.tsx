import { Button } from "../ui/button"

type Props = {label: string, disabled: boolean, process: string}

function SubmitButton({disabled, label, process}: Props) {

    return <Button
          type="submit"
          disabled={disabled}
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          {disabled ? process : label}
        </Button>
}

export default SubmitButton;