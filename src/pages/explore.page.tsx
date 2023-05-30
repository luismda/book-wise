import { Binoculars, MagnifyingGlass } from 'phosphor-react'

import { DefaultLayout } from '@/layouts/DefaultLayout'
import { BookCard } from '@/components/BookCard'
import { CategoryTag } from '@/components/CategoryTag'
import { TextInput } from '@/components/TextInput'
import { Heading } from '@/components/Heading'

import bookImg from '../../public/images/books/domain-driven-design.png'

export default function Explore() {
  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading.Root>
          <Heading.Icon>
            <Binoculars />
          </Heading.Icon>

          <Heading.Title>Explorar</Heading.Title>
        </Heading.Root>

        <form className="w-full max-w-[420px]">
          <TextInput.Root iconPosition="right">
            <TextInput.Input
              type="text"
              placeholder="Buscar livro ou autor"
              aria-label="Digite o nome de um livro ou de um autor para buscar"
            />

            <TextInput.Icon>
              <MagnifyingGlass />
            </TextInput.Icon>
          </TextInput.Root>
        </form>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <CategoryTag isChecked onCheckedChange={() => {}}>
          Tudo
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Computação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
        <CategoryTag isChecked={false} onCheckedChange={() => {}}>
          Educação
        </CategoryTag>
      </div>

      <main className="mt-13 grid grid-cols-3 gap-5">
        <BookCard
          name="Domain-Driven Design"
          author="Eric Evans"
          ratingStarsAmount={4}
          cover={{
            url: bookImg.src,
            altText: '',
            size: 'md',
          }}
        />
        <BookCard
          name="Domain-Driven Design"
          author="Eric Evans"
          ratingStarsAmount={4}
          cover={{
            url: bookImg.src,
            altText: '',
            size: 'md',
          }}
        />
        <BookCard
          name="Domain-Driven Design"
          author="Eric Evans"
          ratingStarsAmount={4}
          cover={{
            url: bookImg.src,
            altText: '',
            size: 'md',
          }}
        />
        <BookCard
          name="Domain-Driven Design"
          author="Eric Evans"
          ratingStarsAmount={4}
          cover={{
            url: bookImg.src,
            altText: '',
            size: 'md',
          }}
        />
      </main>
    </div>
  )
}

Explore.layout = DefaultLayout
