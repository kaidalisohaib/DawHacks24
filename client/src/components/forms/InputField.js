//VERIFY TO MAKE SURE THAT ITS CORRECT
/**
 * InputField is a component for rendering an input field with a label.
 * @component
 * @param {object} props - The props for the InputField component.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.type - The type of the input field (e.g., 'text', 'number').
 * @param {string} props.name - The name attribute of the input field.
 * @param {function} props.onChange - The onChange event handler for the input field.
 * @returns {JSX.Element} The rendered input field.
 */
function InputField({ label, type, name, onChange }) {
  return (
    <section className="input-field">
      <label htmlFor={name}>{label}: </label>
      <input type={type} name={name} onChange={onChange} min={0}/>
    </section>
  );
}
  
export default InputField;