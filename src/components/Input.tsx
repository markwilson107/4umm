import { ErrorResponseIssues } from "@/types/error";
import React from "react";

type Variant = "default" | "underline";

type InputFieldProps = {
	id: string;
	label?: string;
	placeholder?: string;
	type?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	className?: string;
	variant?: Variant;
	errors: ErrorResponseIssues;
	multiline?: boolean;
};

export default function InputField({
	id,
	label,
	placeholder,
	type = "text",
	value,
	onChange,
	className = "",
	variant = "default",
	errors,
	multiline = false,
}: InputFieldProps) {
	let variantClasses = "";

	if (variant === "default") {
		variantClasses =
			"rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
	} else if (variant === "underline") {
		variantClasses =
			"border-0 border-b border-gray-400 bg-transparent px-0 py-2 focus:border-blue-500 focus:ring-0";
	}

	const inputClasses =
		"w-full text-sm focus:outline-none " +
		variantClasses +
		" " +
		className +
		(errors[id] ? " border !border-red-500" : "");

	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			{multiline ? (
				<textarea
					id={id}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={inputClasses + " min-h-[117px] "}
					rows={5}
				/>
			) : (
				<input
					id={id}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={inputClasses}
				/>
			)}
			{errors[id] && (
				<ul className="text-red-400 text-sm">
					{errors[id]?.map((e) => (
						<li>{e}</li>
					))}
				</ul>
			)}
		</div>
	);
}
