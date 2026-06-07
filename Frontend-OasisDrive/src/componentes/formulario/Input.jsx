function Input({
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    className = "",
    name = "",
    minLength
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            name={name}
            minLength={minLength}
            className={`
                w-full px-4 py-3 rounded-2xl
                bg-white/5 border border-white/10
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/30
                transition
                disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed
                backdrop-blur-xl
                ${className}
            `}
        />
    );
}

export default Input;