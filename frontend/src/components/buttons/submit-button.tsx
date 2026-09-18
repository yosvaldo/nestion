import { Button } from "../ui/button"

type Props = {label: string, disabled: boolean, process: string}

function SubmitButton({disabled, label, process}: Props) {

    return <Button
          type="submit"
          disabled={disabled}
          size="lg"
        >
          {disabled ? process : label}
        </Button>
}

export default SubmitButton;