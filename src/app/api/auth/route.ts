import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// URLs corretas da API
const STAKBROKER_API = 'https://app.stakbroker.com/api';
const API_TOKEN = 'qd1gzjfrns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    console.log('Tentando autenticar usuário:', userId);

    // Primeiro, verifica se o token é válido
    const authResponse = await fetch(`${STAKBROKER_API}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({ userId })
    });

    console.log('Resposta da API:', authResponse.status);

    if (!authResponse.ok) {
      throw new Error('Token inválido ou expirado');
    }

    // Se autenticado com sucesso, busca os dados do usuário
    const userResponse = await fetch(`${STAKBROKER_API}/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Usuário não encontrado');
    }

    const userData = await userResponse.json();

    return NextResponse.json({
      success: true,
      token: API_TOKEN,
      user: {
        id: userData.id,
        email: userData.email,
        isActive: userData.isActive
      }
    });

  } catch (error: any) {
    console.error('Erro na autenticação:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
}

// Rota para validar token
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const response = await fetch(`${STAKBROKER_API}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Erro na validação do token:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}