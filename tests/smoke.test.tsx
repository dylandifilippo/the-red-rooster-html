import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('test setup', () => {
  it('renders JSX', () => {
    render(<h1>ok</h1>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
})
