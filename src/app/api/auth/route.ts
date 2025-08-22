import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// URLs e configurações
const STAKBROKER_API = 'https://app.stakbroker.com/api';
const API_TOKEN = 'qd1gzjfrns';
const VALID_USER_ID = '01K306AVZMKRFWDR7XK2B9E2W1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    console.log('Tentando autenticar usuário:', userId);

    // Verifica se o ID do usuário corresponde
    if (userId !== VALID_USER_ID) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID de usuário inválido'
        },
        { status: 401 }
      );
    }

    // Se o ID for válido, retorna sucesso com o token
    return NextResponse.json({
      success: true,
      token: API_TOKEN,
      user: {
        id: VALID_USER_ID,
        email: 'user@stakbroker.com',
        isActive: true
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

    if (!token || token !== API_TOKEN) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: VALID_USER_ID,
      email: 'user@stakbroker.com',
      isActive: true
    });

  } catch (error: any) {
    console.error('Erro na validação do token:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}