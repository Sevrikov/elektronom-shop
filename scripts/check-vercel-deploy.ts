async function main() {
  const url = 'https://elektronom.vercel.app/uk/product/avtomatychnyy-vymykach-ukrem-va-2017-b-3r-4a-asko-a0010170061'
  console.log('Checking live Vercel deployment:', url)
  const res = await fetch(url)
  const text = await res.text()
  
  console.log('Includes "Кількість полюсів":', text.includes('Кількість полюсів'))
  console.log('Includes "Характеристика відключення":', text.includes('Характеристика відключення'))
  console.log('Includes "Вага, кг":', text.includes('Вага, кг'))
  console.log('Includes "Perevaha":', text.includes('Perevaha'))
}

main()
