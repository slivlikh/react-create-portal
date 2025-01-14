import React from "react"
import { render, within } from "@testing-library/react"
import PortalProvider from "./PortalProvider"
import createPortal from "./createPortal"

describe("Slot", () => {
  it("renders a portal", () => {
    const [Slot, Render] = createPortal()
    const { getByText } = render(
      <PortalProvider>
        <div>
          Awesome <Slot />
        </div>
        <Render>Portal Layout</Render>
      </PortalProvider>
    )
    const slotContainer = getByText("Awesome")
    within(slotContainer).getByText("Portal Layout")
  })
  it("reveive style & className", () => {
    const [Slot, Render] = createPortal()
    const { getByText, container } = render(
      <PortalProvider>
        <div>
          Slot Container <Slot className="slot" style={{ display: "inline" }} />
        </div>
        <Render>Styled</Render>
      </PortalProvider>
    )
    const slot = getByText("Styled")
    expect(slot.classList.contains("slot")).toBeTruthy()
    expect(slot.style).toMatchObject({ display: "inline" })
    expect(container.firstChild).toMatchSnapshot()
  })
  test("pass data from Slot to Render", () => {
    const [Slot, Render] = createPortal()
    const { getByText } = render(
      <PortalProvider>
        <div>
          Awesome <Slot payload={{ data: "payload" }} />
        </div>
        <Render>{(payload: any) => <>Portal Layout {payload.data}</>}</Render>
      </PortalProvider>
    )
    const slotContainer = getByText("Awesome")
    within(slotContainer).getByText("Portal Layout payload")
  })
  it("hides Slot if no Render", () => {
    const [Slot, _, useCount] = createPortal()
    const Container = () => {
      const rendersCount = useCount()
      return (
        <Slot
          style={{ display: rendersCount === 0 ? "none" : "block" }}
          id="slot"
        />
      )
    }
    render(
      <PortalProvider>
        <div>
          Awesome <Container />
        </div>
      </PortalProvider>
    )
    expect(document.querySelector("#slot")).toHaveStyle(`display: none;`)
  })
  test("Provider remount", () => {
    const [Slot, Render] = createPortal()
    const Container = ({ slotKey }: { slotKey: boolean }) =>
      slotKey ? (
        <PortalProvider>
          <div>
            Awesome <Slot />
          </div>
          <Render>Portal Layout</Render>
        </PortalProvider>
      ) : (
        <div>
          <PortalProvider>
            <div>
              Awesome <Slot />
            </div>
            <Render>Portal Layout</Render>
          </PortalProvider>
        </div>
      )
    const { getByText, rerender } = render(<Container slotKey={true} />)
    let slotContainer = getByText("Awesome")
    within(slotContainer).getByText("Portal Layout")
    rerender(<Container slotKey={false} />)
    slotContainer = getByText("Awesome")
    within(slotContainer).getByText("Portal Layout")
  })
  test("Slot fallback", () => {
    const [Slot, _] = createPortal()
    const Container = () => {
      return <Slot id="slot" fallback={<span>Fallback</span>} />
    }
    const { getByText } = render(
      <PortalProvider>
        <div>
          Awesome <Container />
        </div>
      </PortalProvider>
    )
    const slotContainer = getByText("Awesome")
    within(slotContainer).getByText("Fallback")
  })
})
