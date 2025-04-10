/* -------------------------------------------------------------------------- */
/*                Archivo de definición de caja de herramientas               */
/* -------------------------------------------------------------------------- */

//JSON de caja de herramientas
export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    //Categoria de bloques de función
    {
      kind: 'category',
      name: 'Funciones',
      categorystyle: 'c_function',
      contents: [
        //Bloque de definición de función
        {
          kind: 'block',
          type: 'c_function_definition'
        },
        //Bloque de parametro de función
        {
          kind: 'block',
          type: 'c_function_parameter'
        },
        //Bloque de retorno de función
        {
          kind: 'block',
          type: 'c_function_return'
        },
        //Bloque de llamada de función
        {
          kind: 'block',
          type: 'c_function_call'
        },
      ]
    },
    //Categoria de bloques de variable
    {
      kind: 'category',
      name: 'Variables',
      categorystyle: 'c_variable',
      contents: [
        //Bloque de declaración de variable
        {
          kind: 'block',
          type: 'c_variable_declaration'
        },
        //Bloque de asignación de valor de variable
        {
          kind: 'block',
          type: 'c_variable_set',
          inputs: {
            INPUT_VALUE_IDENTIFIER: {
              shadow: {
                type: 'c_variable_output',
              }
            },
            INPUT_VALUE_SET: {
              shadow: {
                type: 'c_value_number',
                fields:{
                  FIELD_NUMBER_VALUE: 0
                }
              }
            }
          }
        },
        //Bloque de salida de variable
        {
          kind: 'block',
          type: 'c_variable_output'
        }
      ]
    },
    //Categoria de bloques de valor
    {
      kind: 'category',
      name: 'Valores',
      categorystyle: 'c_value',
      contents: [
        //Bloque de valor numérico
        {
          kind: 'block',
          type: 'c_value_number'
        },
        //Bloque de valor nulo
        {
          kind: 'block',
          type: 'c_value_null'
        },
      ]
    },
    //Categoría de bloques de condición
    {
      kind: 'category',
      name: 'Condición',
      categorystyle: 'c_condition',
      contents: [
        //Bloque if - else
        {
          kind: 'block',
          type: 'c_condition_if',
          //Inciailizar entrada de condición con un valor numérico con valor 1
          inputs: {
            INPUT_VALUE_CONDITION: {
                shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque switch
        {
          kind: 'block',
          type: 'c_condition_switch',
          //Inciailizar entrada de condición con un valor numérico con valor 1
          inputs: {
            INPUT_VALUE_VARIABLE: {
                shadow: {
                type: 'c_variable_output',
              }
            },
          }
        },
      ]
    },
    //Categoría de bloques de operaciones
    {
      kind: 'category',
      name: 'Matemáticas',
      categorystyle: 'c_math',
      contents: [
        //Bloque de operación aritmética binaria
        {
          kind: 'block',
          type: 'c_math_binary_operation_arithmetic',
          //Inciailizar entradas de operadores con un valor numérico con valor 1
          inputs: {
            INPUT_VALUE_OPERAND_1: {
                shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            },
            INPUT_VALUE_OPERAND_2: {
                shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque de constantes matemáticas
        {
          kind: 'block',
          type: 'c_math_constants',
        },
        //Bloque de operación unarias básica
        {
          kind: 'block',
          type: 'c_math_unary_operation',
          inputs: {
            INPUT_VALUE_OPERAND: {
              shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        }
      ]
    },
    //Categoría de bloques de lógica
    {
      kind: 'category',
      name: 'Lógica',
      categorystyle: 'c_logic',
      contents: [
        //Bloque de comparador lógico
        {
          kind: 'block',
          type: 'c_logic_comparator',
          inputs: {
            INPUT_VALUE_COMPARAND_1: {
              shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            },
            INPUT_VALUE_COMPARAND_2: {
              shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque de operación lógica
        {
          kind: 'block',
          type: 'c_logic_operator',
          inputs: {
            INPUT_VALUE_OPERAND_1: {
              shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            },
            INPUT_VALUE_OPERAND_2: {
              shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
      ]
    },
    //Categoría de bloques de bucles
    {
      kind: 'category',
      name: 'Bucle',
      categorystyle: 'c_loop',
      contents: [
        //Bloque de bucle While
        {
          kind: 'block',
          type: 'c_loop_while',
          inputs: { 
            INPUT_VALUE_CONDITION:{
              shadow:{
                type: 'c_value_number',
                fields:{
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque de bucle Do While
        {
          kind: 'block',
          type: 'c_loop_do_while',
          inputs: { 
            INPUT_VALUE_CONDITION:{
              shadow:{
                type: 'c_value_number',
                fields:{
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque de bucle For de incremento
        {
          kind: 'block',
          type: 'c_loop_for_increment',
          inputs: {
            INPUT_VALUE_IDENTIFIER:{
              shadow:{
                type: 'c_variable_output'
              }
            },
            INPUT_VALUE_BEGINNING:{
              shadow:{
                type: 'c_value_number'
              }
            },
            INPUT_VALUE_CONDITION:{
              shadow:{
                type: 'c_logic_comparator',
                inputs:{
                  INPUT_VALUE_COMPARAND_1:{
                    shadow:{
                      type: 'c_variable_output'
                    }
                  },
                  INPUT_VALUE_COMPARAND_2:{
                    shadow:{
                      type: 'c_value_number'
                    }
                  }
                },
                fields:{
                  FIELD_DROPDOWN_COMPARATOR: 'COMPARATOR_LESS'
                }
              }
            },
            INPUT_VALUE_INCREMENT:{
              shadow:{
                type: 'c_value_number',
                fields:{
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque de modificador de flujo de bucle
        {
          kind: 'block',
          type: 'c_loop_flow_modifier',
        }
      ]
    },
     //Categoría de bloques de impresión
    {
      kind: 'category',
      name: 'Impresión',
      categorystyle: 'c_print',
      contents: [
        //Bloque de impresión de cadena simple
        {
          kind: 'block',
          type: 'c_print_simple_string'
        },
        //Bloque de impresión de variable simple
        {
          kind: 'block',
          type: 'c_print_simple_variable',
          inputs: {
            INPUT_VALUE_OUTPUT: {
              shadow: {
                type: 'c_variable_output',
              }
            }
          }
        }
      ]
    },
    //Categoría de bloques de entrada
    {
      kind: 'category',
      name: 'Lectura',
      categorystyle: 'c_input',
      contents: [
        //Bloque de scanf simple
        {
          kind: 'block',
          type: 'c_input_scanf_simple',
          inputs: {
            INPUT_VALUE_IDENTIFIER: {
              shadow: {
                type: 'c_variable_output',
              }
            },
          }
        }
      ]
    },
    //Categoría de bloques de estructura
    {
      kind: 'category',
      name: 'Estructura',
      categorystyle: 'c_struct',
      contents: [
        //Bloque de definición de struct
        {
          kind: 'block',
          type: 'c_struct_definition'
        },
        //Bloque de miembro de estructura
        {
          kind: 'block',
          type: 'c_struct_member_get',
          inputs: {
            INPUT_VALUE_IDENTIFIER: {
              shadow: {
                type: 'c_variable_output',
              }
            }
          }
        },
      ],
    },
    //Categoría de bloques de apuntador
    {
      kind: 'category',
      name: 'Apuntadores',
      categorystyle: 'c_pointer',
      contents: [
        //Bloque de salida de dato de apuntador
        {
          kind: 'block',
          type: 'c_pointer_output',
          inputs: {
            INPUT_VALUE_IDENTIFIER: {
              shadow: {
                type: 'c_variable_output',
              }
            }
          }
          
        }
      ]
    },
    //Categoría de bloques de memoria
    {
      kind: 'category',
      name: 'Memoria',
      categorystyle: 'c_memory',
      contents: [
        //Bloque de dirección memoria
        {
          kind: 'block',
          type: 'c_memory_address',
          inputs: {
            INPUT_VALUE_IDENTIFIER: {
              shadow: {
                type: 'c_variable_output',
              }
            }
          }
        },
        //Bloque de reserva de memoria
        {
          kind: 'block',
          type: 'c_memory_malloc',
          inputs: {
            INPUT_VALUE_SIZE: {
              shadow: {
                type: 'c_value_number',
                fields: {
                  FIELD_NUMBER_VALUE: 1
                }
              }
            }
          }
        },
        //Bloque de reserva de memoria
        {
          kind: 'block',
          type: 'c_memory_free',
          inputs: {
            INPUT_VALUE_IDENTIFIER: {
              shadow: {
                type: 'c_variable_output',
              }
            }
          }
        }
      ]
    }
  ]
};
