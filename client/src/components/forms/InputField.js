function InputField({ label, type, name, onChange }) {
  return (
    <section className="input-field">
      <label htmlFor={name}>{label}: </label>
      <input type={type} name={name} onChange={onChange} min={0}/>
    </section>
  );
}
  
export default InputField;