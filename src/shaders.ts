class Shader {
  public vertex_shader = ""
  public fragment_shader = ""

  private vertex_shader_url:string
  private fragment_shader_url:string

  constructor(vertex_shader_url:string, fragment_shader_url:string) {
    this.fragment_shader_url = fragment_shader_url
    this.vertex_shader_url = vertex_shader_url
  }
  
  load_shader = async () => {
    this.fragment_shader = await (await fetch(this.fragment_shader_url)).text()
    this.vertex_shader = await (await fetch(this.vertex_shader_url)).text()
  }
}

export const shaders = new Map<string, Shader>();

shaders.set("grass", new Shader("/shaders/grass_vsh.glsl", "/shaders/grass_fsh.glsl"))

const load_shaders = async () => {
  for (const [key, value] of shaders) {
    await value.load_shader()
  }
}

await load_shaders()
