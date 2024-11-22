export default function isNull(
  value: any,
): value is null | undefined | '' | 'null' | 'undefined' {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'null' ||
    value === 'undefined'
  );
}
