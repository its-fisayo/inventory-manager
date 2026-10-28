import type { InputHTMLAttributes } from "react";

type InputProps = {
    label ?: string,
    className ?: string,
} & InputHTMLAttributes<HTMLInputElement>

function Input({label, className, ...props}: InputProps) {
    const base = "w-full h-[42px] rounded-[10px] px-2 border-[#777376] border-[0.9px] focus:outline-[#711460]";

    return (
        <div className="flex flex-col gap-[5px]">
            {label && <label className="text-[15px] font-bold text-[grey]">{label}</label>}
            <input className={`${base} ${className}`} {...props}/>
        </div>
    )
}

export default Input;