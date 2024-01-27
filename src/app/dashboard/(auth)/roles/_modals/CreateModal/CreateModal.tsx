import React from "react";
import FormModal from "../FormModal";

interface Props {
	opened: boolean
	onClose?: () => void
}

export default function CreateModal(props: Props) {
	return (
		<FormModal
			title="Create new role"
			data={{
				code: "",
				description: "",
				id: "",
				isActive: false,
				name: "",
			}}
			readonly={false}
			opened={props.opened}
			onClose={props.onClose}
		/>
	);
}
