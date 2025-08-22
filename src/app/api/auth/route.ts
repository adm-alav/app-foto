import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STAKBROKER_API = 'https://mybroker-broker-api.readme.io/token';
const API_TOKEN = 'qd1gzjfrns';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${STAKBROKER_API}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    const response = await fetch(`${STAKBROKER_API}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }

    const data = await response.json();

    // Verifica se o ID do usuário corresponde
    if (data.id !== userId) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: API_TOKEN,
      user: data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
