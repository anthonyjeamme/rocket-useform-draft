<center>
  <img height="200" src="https://res.cloudinary.com/anthony-jeamme-stuff/image/upload/v1619382044/shares/rocket-use-form.svg">

# Rocket useForm

</center>

Rocket useForm is a rich React library based on useRef.
It's a easy-to-use solution to build big and complex forms.

## Installation

```bash
npm i rocket-useform
```

```bash
yarn install rocket-useform
```

## Getting started

```tsx
const data = {
	name: 'john doe'
}
```

```tsx
const schema = Schema({
	name: textField()
})
```

```tsx
const form = useForm(data, schema)
```
