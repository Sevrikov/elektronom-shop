async function main() {
  const url = 'https://elektronom.vercel.app/uk/product/avtomatychnyy-vymykach-ukrem-va-2017-b-3r-4a-asko-a0010170061'
  console.log('Checking live Vercel deployment:', url)
  const res = await fetch(url)
  const text = await res.text()
  
  console.log('Includes "Тип монтажу":', text.includes('Тип монтажу'))
  console.log('Includes "Частота струму":', text.includes('Частота струму'))
  console.log('Includes "Роль":', text.includes('Роль'))
}

main()
