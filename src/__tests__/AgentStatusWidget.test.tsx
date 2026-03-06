import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgentStatusWidget } from "../components/AgentStatusWidget";
import { useMikuStore } from "../store/useMikuStore";
import React from "react";

describe("AgentStatusWidget 리허설 🎹✨", () => {
  it("기본 IDLE 상태를 올바르게 연주해야 해요! 🎤💚", () => {
    // 🎻 스토어 상태를 IDLE로 설정!
    useMikuStore.setState({ status: "IDLE", currentTask: "TESTING" });
    
    render(<AgentStatusWidget />);
    
    expect(screen.getAllByText(/IDLE/)[0]).toBeDefined();
    expect(screen.getAllByText(/IDLE_MODE/)[0]).toBeDefined();
    expect(screen.getByText(/TESTING/)).toBeDefined();
  });

  it("THINKING 상태일 때 인지 처리 중임을 보여줘야 해요! 🧠🟡", () => {
    useMikuStore.setState({ status: "THINKING", currentTask: "DEEP_THOUGHTS" });
    
    render(<AgentStatusWidget />);
    
    expect(screen.getAllByText(/THINKING/i)[0]).toBeDefined();
    expect(screen.getAllByText(/THINKING_MODE/)[0]).toBeDefined();
  });

  it("WORKING 상태일 때 시스템 실행 중임을 보여줘야 해요! ⚡🔵", () => {
    useMikuStore.setState({ status: "WORKING", currentTask: "EXECUTING_COMMANDS" });
    
    render(<AgentStatusWidget />);
    
    expect(screen.getAllByText(/WORKING/i)[0]).toBeDefined();
    expect(screen.getAllByText(/WORKING_MODE/)[0]).toBeDefined();
  });

  it("INTERMISSION 상태일 때 IDLE_MODE로 매핑해서 보여줘야 해요! 🍵", () => {
    useMikuStore.setState({ status: "INTERMISSION", currentTask: "RESTING" });
    
    render(<AgentStatusWidget />);
    
    expect(screen.getAllByText(/IDLE/)[0]).toBeDefined();
    expect(screen.getAllByText(/IDLE_MODE/)[0]).toBeDefined();
    expect(screen.getByText(/RESTING/)).toBeDefined();
  });
});
