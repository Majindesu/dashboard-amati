import { Text } from "@mantine/core";
import React from "react";

import classNames from "./childMenu.module.css";
import { MenuItem } from "../_data/allMenu";
import { isNotEmpty } from "@mantine/form";

interface Props {
	item: NonNullable<MenuItem["children"]>[number];
}

export default function ChildMenu(props: Props) {
	return (
		<Text<"a">
			component="a"
			className={classNames.link}
			href={props.item.link}
            onClick={(e) => e.preventDefault()}
		>
            {props.item.label}
        </Text>
	);
}
